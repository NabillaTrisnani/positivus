import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// GET ALL SERVICE (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.partner, req, {
            searchFields: ["headerText"],
        });

        return NextResponse.json({
            success: true,
            ...result,
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

// CREATE SERVICE
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const name = formData.get("name") as string;
        const logo = formData.get("logo") as File | null;

        // Validasi field
        if (!name) {
            return NextResponse.json(
                { success: false, message: "Partner name is required" },
                { status: 400 }
            );
        } else if (!logo) {
            return NextResponse.json(
                { success: false, message: "Partner logo is required" },
                { status: 400 }
            );
        }

        // Upload foto ke Cloudinary
        const bytes = await logo.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<{ secure_url: string }>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder: "partner-logo" },
                        (error, result) => {
                            if (error || !result) reject(error);
                            else resolve(result);
                        }
                    )
                    .end(buffer);
            }
        );

        // Simpan ke database
        const partner = await prisma.partner.create({
            data: {
                name,
                logo: uploadResult.secure_url, // URL dari Cloudinary
            },
        });

        return NextResponse.json(
            { success: true, data: partner },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create partner:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create partner" },
            { status: 500 }
        );
    }
}