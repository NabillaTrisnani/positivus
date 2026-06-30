"use client";

import { ChevronLeft, ChevronRight, Eye, Loader2, PencilLine, Trash2 } from "lucide-react";
import Button from "./button";
import Input from "./input";
import { useEffect, useState } from "react";
import type { PaginationMeta } from "@/lib/pagination";

export type Column<T> = {
    /** Text shown in the table header for this column. */
    header: string;
    /**
     * How to render this column's cell. Either:
     *  - a key of the row object (renders the value as plain text), e.g. `accessor: "title"`, or
     *  - a function returning custom JSX, e.g.
     *      `accessor: (row) => <p>{row.title}</p>`
     *      `accessor: (row) => <img src={row.avatar} />`
     */
    accessor: keyof T | ((row: T) => React.ReactNode);
    /** Extra classes applied to this column's cells. */
    className?: string;
};

/** The query the table emits whenever the user pages, searches, or changes page size. */
export type DataTableQuery = {
    page: number;
    limit: number;
    search: string;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    /** The CURRENT PAGE of rows, as returned by the server. */
    data: T[];
    /** Pagination metadata from the server response (`meta`). */
    meta: PaginationMeta;
    /** Called whenever page, page size, or (debounced) search changes. Drives the fetch. */
    onQueryChange: (query: DataTableQuery) => void;
    /** Disables controls and shows a spinner while a request is in flight. */
    loading?: boolean;
    /** Unique id per row, used as the React key. Defaults to the array index. */
    getRowId?: (row: T, index: number) => string | number;
    onEdit?: (row: T) => void;
    onPreview?: (row: T) => void;
    onDelete?: (row: T) => void;
    /** Show the search box. Default true. */
    searchable?: boolean;
    pageSizeOptions?: number[];
    /** Debounce delay for the search box, in ms. Default 400. */
    searchDebounceMs?: number;
    emptyMessage?: string;
};

function getCellContent<T>(row: T, column: Column<T>): React.ReactNode {
    if (typeof column.accessor === "function") return column.accessor(row);
    return row[column.accessor] as React.ReactNode;
}

export default function DataTable<T>({
    columns,
    data,
    meta,
    onQueryChange,
    loading = false,
    getRowId,
    onEdit,
    onPreview,
    onDelete,
    searchable = true,
    pageSizeOptions = [10, 25, 50, 100],
    searchDebounceMs = 400,
    emptyMessage = "No data available",
}: DataTableProps<T>) {
    const [search, setSearch] = useState<string>("");
    const [debouncedSearch, setDebouncedSearch] = useState<string>("");
    const [pageSize, setPageSize] = useState<number>(pageSizeOptions[0] ?? 10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const hasActions = Boolean(onEdit || onPreview || onDelete);
    const columnCount = columns.length + (hasActions ? 1 : 0);

    // Debounce the search input so we fire one request per typing burst.
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search.trim()), searchDebounceMs);
        return () => clearTimeout(timer);
    }, [search, searchDebounceMs]);

    // Emit a query whenever page / page size / debounced search changes.
    // Also fires on mount, which triggers the initial fetch.
    useEffect(() => {
        onQueryChange({ page: currentPage, limit: pageSize, search: debouncedSearch });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, pageSize, debouncedSearch]);

    const totalPages = meta.totalPages;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const goToPage = (next: number) => {
        setCurrentPage(Math.min(Math.max(next, 1), Math.max(totalPages, 1)));
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-6">
                    <label htmlFor="datatable-page-size" className="text-sm font-medium text-body shrink-0">Show</label>
                    <select
                        id="datatable-page-size"
                        className="border border-solid border-black rounded-[14px] py-2 px-4 text-base w-full outline-none bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        value={pageSize}
                        disabled={loading}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        {pageSizeOptions.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                    <span className="text-sm font-medium text-body whitespace-nowrap">per page</span>
                </div>
                {searchable && (
                    <Input
                        isSearch
                        type="search"
                        className="bg-white mb-6"
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </div>

            <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-[0px_5px_0px_0px_#191A23] rounded-2xl border border-default mb-6">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
                        <Loader2 className="animate-spin text-black" size={24} />
                    </div>
                )}
                <table className="w-full text-sm text-left rtl:text-right text-body bg-white">
                    <thead className="text-sm text-body bg-green text-black border-b rounded-2xl border-default">
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index} scope="col" className={`px-6 py-3 font-medium ${column.className ?? ""}`}>
                                    {column.header}
                                </th>
                            ))}
                            {hasActions && <th scope="col" className="px-6 py-3 font-medium"></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr className="bg-neutral-primary border-b border-default">
                                <td colSpan={columnCount} className="px-6 py-4 text-center text-body">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={getRowId ? getRowId(row, rowIndex) : rowIndex} className="bg-neutral-primary border-b border-default">
                                    {columns.map((column, colIndex) =>
                                        colIndex === 0 ? (
                                            <th key={colIndex} scope="row" className={`px-6 py-4 font-medium whitespace-nowrap ${column.className ?? ""}`}>
                                                {getCellContent(row, column)}
                                            </th>
                                        ) : (
                                            <td key={colIndex} className={`px-6 py-4 ${column.className ?? ""}`}>
                                                {getCellContent(row, column)}
                                            </td>
                                        )
                                    )}
                                    {hasActions && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                {onEdit && (
                                                    <Button className="border border-black p-2 bg-yellow-400 hover:bg-yellow-300" onClick={() => onEdit(row)}>
                                                        <PencilLine size={16} />
                                                    </Button>
                                                )}
                                                {onPreview && (
                                                    <Button className="border border-black p-2 bg-green hover:bg-green-hover" onClick={() => onPreview(row)}>
                                                        <Eye size={16} />
                                                    </Button>
                                                )}
                                                {onDelete && (
                                                    <Button className="border border-black p-2 bg-red-400 hover:bg-red-300" onClick={() => onDelete(row)}>
                                                        <Trash2 size={16} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <nav aria-label="Pagination">
                    <ul className="flex items-center text-sm justify-end">
                        <li>
                            <button
                                type="button"
                                aria-label="Previous page"
                                disabled={loading || !meta.hasPreviousPage}
                                onClick={() => goToPage(currentPage - 1)}
                                className="flex items-center justify-center w-9 h-9 rounded-l-[14px] border border-black bg-white text-black font-medium hover:bg-green-hover transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                            >
                                <ChevronLeft size={16} />
                            </button>
                        </li>
                        {pages.map((p) => (
                            <li key={p}>
                                <button
                                    type="button"
                                    aria-current={p === currentPage ? "page" : undefined}
                                    disabled={loading}
                                    onClick={() => goToPage(p)}
                                    className={`flex items-center justify-center w-9 h-9 border border-black text-black font-medium focus:outline-none disabled:cursor-not-allowed ${p === currentPage ? "bg-green" : "bg-white hover:bg-green-hover transition-colors"}`}
                                >
                                    {p}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                type="button"
                                aria-label="Next page"
                                disabled={loading || !meta.hasNextPage}
                                onClick={() => goToPage(currentPage + 1)}
                                className="flex items-center justify-center w-9 h-9 rounded-r-[14px] border border-black bg-white text-black font-medium hover:bg-green-hover transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </>
    );
}
