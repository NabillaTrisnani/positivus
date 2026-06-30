import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextResponse } from "next/server";

// GET ALL SUBSCRIPTIONS (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.subscription, req, {
            searchFields: ["email"],
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Failed to fetch subriptions:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch subriptions",
            },
            { status: 500 }
        );
    }
}

// CREATE SUBSCRIPTION
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

        const { email } = body;

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is required",
                },
                { status: 400 }
            );
        }

        const subscription = await prisma.subscription.create({
            data: {
                email,
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: subscription,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create subscription:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create subscription",
            },
            { status: 500 }
        );
    }
}