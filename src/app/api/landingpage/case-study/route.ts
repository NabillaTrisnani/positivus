import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await prisma.caseStudy.findMany();

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Failed to fetch case studies:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch case studies",
            },
            { status: 500 }
        );
    }
}