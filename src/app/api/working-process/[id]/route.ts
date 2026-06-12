import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE WORKING PROCESS
export async function GET(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const workingProcess = await prisma.workingProcess.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!workingProcess) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Working process not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: workingProcess,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch working process",
            },
            { status: 500 }
        );
    }
}

// UPDATE WORKING PROCESS
export async function PUT(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const body = await req.json();

        const { title, description } = body;

        const updatedWorkingProcess = await prisma.workingProcess.update({
            where: {
                id: Number(id),
            },
            data: {
                title,
                description,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedWorkingProcess,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update working process",
            },
            { status: 500 }
        );
    }
}

// DELETE WORKING PROCESS
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        await prisma.workingProcess.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Working process deleted",
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete working process",
            },
            { status: 500 }
        );
    }
}