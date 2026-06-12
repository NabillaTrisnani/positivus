import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextResponse } from "next/server";

// GET ALL CONTACTS (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.contact, req, {
            searchFields: ["name", "email", "message", "type"],
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Failed to fetch contacts:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch contacts",
            },
            { status: 500 }
        );
    }
}

// CREATE CONTACT
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

        const { name, email, message, type } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Name, email and message are required",
                },
                { status: 400 }
            );
        }

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                message,
                type: type ?? "contact",
            },
        });

        return NextResponse.json(
            {
                success: true,
                data: contact,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create contact:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create contact",
            },
            { status: 500 }
        );
    }
}