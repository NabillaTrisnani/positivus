import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextResponse } from "next/server";

// GET ALL WORKING PROCCESS (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.workingProcess, req, {
            searchFields: ["title", "description"],
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

// CREATE WORKING PROCESS
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

        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and description are required",
                },
                { status: 400 }
            );
        }

        const workingProcess = await prisma.workingProcess.create({
            data: {
                title,
                description,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: workingProcess,
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