import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextResponse } from "next/server";

// GET ALL SOCIAL MEDIA LINK (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.socialMedia, req, {
            searchFields: ["link", "platform"],
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Failed to fetch social media links:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch social media links",
            },
            { status: 500 }
        );
    }
}

// CREATE SOCIAL MEDIA LINK
export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);

        if (!body) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Request body must be valid JSON",
                },
                { status: 400 }
            );
        }

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

        const subscription = await prisma.socialMedia.create({
            data: {
                link,
                platform,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: subscription,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create social media link:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create social media link",
            },
            { status: 500 }
        );
    }
}