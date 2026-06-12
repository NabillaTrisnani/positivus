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
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch contact",
            },
            { status: 500 }
        );
    }
}

// UPDATE CONTACT
export async function PUT(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const body = await req.json();

        const { name, email } = body;

        const updatedContact = await prisma.contact.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                email,
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedContact,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update contact",
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
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete contact",
            },
            { status: 500 }
        );
    }
}