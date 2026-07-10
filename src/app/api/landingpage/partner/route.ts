import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await prisma.partner.findMany();

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Failed to fetch partners:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch partners",
            },
            { status: 500 }
        );
    }
}