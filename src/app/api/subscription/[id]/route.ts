import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// DELETE CONTACT
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        await prisma.subscription.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Contact deleted",
        });
    } catch (error) {
        console.error("Failed to delete subscription:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete subscription",
            },
            { status: 500 }
        );
    }
}