import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await prisma.service.findMany();

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Failed to fetch services:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch services",
            },
            { status: 500 }
        );
    }
}