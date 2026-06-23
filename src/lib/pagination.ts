/**
 * Reusable pagination + search helpers for API list endpoints.
 *
 * Reads `page`, `limit` and `search` from the request query string, runs a
 * Prisma `findMany` + `count` against any model, and returns the rows together
 * with pagination metadata.
 *
 * Example:
 *   const result = await paginate(prisma.contact, req, {
 *       searchFields: ["name", "email", "message", "type"],
 *   });
 *   return NextResponse.json({ success: true, ...result });
 */

export const initialMeta: PaginationMeta = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
};

export type PaginationParams = {
    page: number;
    limit: number;
    search: string;
    skip: number;
};

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type PaginatedResult<TItem> = {
    data: TItem[];
    meta: PaginationMeta;
};

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/** Parse `page`, `limit` and `search` from the request URL, with safe bounds. */
export function getPaginationParams(req: Request): PaginationParams {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const rawLimit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
    const limit = Math.min(MAX_LIMIT, Math.max(1, rawLimit));
    const search = (searchParams.get("search") ?? "").trim();
    const skip = (page - 1) * limit;

    return { page, limit, search, skip };
}

/**
 * Build a Prisma `where` fragment that does a case-insensitive "contains"
 * match across the given string fields. Returns `{}` when there is nothing
 * to search for so it can be spread into any query.
 */
export function buildSearchFilter(search: string, fields: string[]) {
    if (!search || fields.length === 0) {
        return {};
    }

    return {
        OR: fields.map((field) => ({
            [field]: { contains: search, mode: "insensitive" as const },
        })),
    };
}

function buildMeta(params: PaginationParams, total: number): PaginationMeta {
    const totalPages = total === 0 ? 0 : Math.ceil(total / params.limit);

    return {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
    };
}

/** Minimal structural shape of a Prisma model delegate used for pagination. */
type PaginatableModel<TItem> = {
    findMany: (args: {
        where?: object;
        orderBy?: object;
        skip?: number;
        take?: number;
    }) => Promise<TItem[]>;
    count: (args: { where?: object }) => Promise<number>;
};

export type PaginateOptions = {
    /** String fields to run the case-insensitive search across. */
    searchFields?: string[];
    /** Prisma `orderBy` clause. Defaults to newest first (`{ id: "desc" }`). */
    orderBy?: object;
};

/**
 * Run a paginated, searchable query against a Prisma model delegate.
 * Returns the page of rows plus pagination metadata.
 */
export async function paginate<TItem>(
    model: PaginatableModel<TItem>,
    req: Request,
    options: PaginateOptions = {}
): Promise<PaginatedResult<TItem>> {
    const params = getPaginationParams(req);
    const where = buildSearchFilter(params.search, options.searchFields ?? []);

    const [data, total] = await Promise.all([
        model.findMany({
            where,
            orderBy: options.orderBy ?? { id: "desc" },
            skip: params.skip,
            take: params.limit,
        }),
        model.count({ where }),
    ]);

    return { data, meta: buildMeta(params, total) };
}
