import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE CASE STUDY
export async function GET(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const caseStudy = await prisma.caseStudy.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!caseStudy) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Case study not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: caseStudy,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch case study",
            },
            { status: 500 }
        );
    }
}

// UPDATE CASE STUDY
export async function PUT(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const body = await req.json();

        const { text } = body;

        const updatedCaseStudy = await prisma.caseStudy.update({
            where: {
                id: Number(id),
            },
            data: {
                text,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedCaseStudy,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update case study",
            },
            { status: 500 }
        );
    }
}

// DELETE CASE STUDY
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        await prisma.caseStudy.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Case study deleted",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete case study",
            },
            { status: 500 }
        );
    }
}