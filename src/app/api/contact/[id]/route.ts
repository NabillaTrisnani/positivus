import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE CONTACT
export async function GET(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const contact = await prisma.contact.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!contact) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Contact not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: contact,
        });
    } catch (error) {
        console.error("Failed to get contact:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch contact",
            },
            { status: 500 }
        );
    }
}

// DELETE CONTACT
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        await prisma.contact.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Contact deleted",
        });
    } catch (error) {
        console.error("Failed to delete contact:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete contact",
            },
            { status: 500 }
        );
    }
}