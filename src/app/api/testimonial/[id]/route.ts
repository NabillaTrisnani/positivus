import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE TESTIMONIAL
export async function GET(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const testimonial = await prisma.testimonial.findUnique({
            where: {
                id: Number(id),
            },
        });

        if (!testimonial) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Testimonial not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: testimonial,
        });
    } catch (error) {
        console.error("Failed to fetch testimonial:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch testimonial",
            },
            { status: 500 }
        );
    }
}

// UPDATE TESTIMONIAL
export async function PUT(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const body = await req.json();

        const { name, position, company, testimony } = body;

        const updatedTestimonial = await prisma.testimonial.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                position,
                company,
                testimony
            },
        });

        return NextResponse.json({
            success: true,
            data: updatedTestimonial,
        });
    } catch (error) {
        console.error("Failed to update testimonial:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update testimonial",
            },
            { status: 500 }
        );
    }
}

// DELETE TESTIMONIAL
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        await prisma.testimonial.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({
            success: true,
            message: "Testimonial deleted",
        });
    } catch (error) {
        console.error("Failed to delete testimonial:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete testimonial" + error,
            },
            { status: 500 }
        );
    }
}