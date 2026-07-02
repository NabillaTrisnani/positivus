import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE SOCIAL MEDIA
export async function GET(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const link = await prisma.socialMedia.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!link) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Social Media not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: link,
        });
    } catch (error) {
        console.error("Failed to fetch link:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch link",
            },
            { status: 500 }
        );
    }
}

// UPDATE SOCIAL MEDIA
export async function PUT(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const body = await req.json();

        const { link, platform } = body;

        if (!link) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Link is required",
                },
                { status: 400 }
            );
        }

        if (!platform) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Platform is required",
                },
                { status: 400 }
            );
        }

        const updatedLink = await prisma.socialMedia.update({
            where: {
                id: Number(id),
            },
            data: {
                link,
                platform,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedLink,
        });
    } catch (error) {
        console.error("Failed to update link:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update link",
            },
            { status: 500 }
        );
    }
}

// DELETE SOCIAL MEDIA
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        await prisma.socialMedia.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Social Media deleted",
        });
    } catch (error) {
        console.error("Failed to delete link:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete link" + error,
            },
            { status: 500 }
        );
    }
}