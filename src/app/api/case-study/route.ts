import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextResponse } from "next/server";

// GET ALL CASE STUDY (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.caseStudy, req, {
            searchFields: ["text"],
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Failed to fetch working processes:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch working processes",
            },
            { status: 500 }
        );
    }
}

// CREATE CASE STUDY
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

        const { text } = body;

        if (!text) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Text are required",
                },
                { status: 400 }
            );
        }

        const caseStudy = await prisma.caseStudy.create({
            data: {
                text,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: caseStudy,
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