import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextResponse } from "next/server";

// GET ALL TESTIMONIAL (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.testimonial, req, {
            searchFields: ["name", "position", "company", "testimony"],
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch testimonials",
            },
            { status: 500 }
        );
    }
}

// CREATE TESTIMONIAL
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

        const { name, position, company, testimony } = body;

        if (!name || !position || !testimony) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, position and testimony are required",
                },
                { status: 400 }
            );
        }

        const testimonial = await prisma.testimonial.create({
            data: {
                name,
                position,
                company,
                testimony
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: testimonial,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create working process:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create working process",
            },
            { status: 500 }
        );
    }
}