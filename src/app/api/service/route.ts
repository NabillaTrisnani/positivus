import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// GET ALL SERVICE (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.service, req, {
            searchFields: ["headerText"],
        });

        return NextResponse.json({
            success: true,
            ...result,
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

// CREATE SERVICE
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const cardBackground = formData.get("cardBackground") as string;
        const headerText = formData.get("headerText") as string;
        const headerTextColor = formData.get("headerTextColor") as string;
        const headerBackgroundColor = formData.get("headerBackgroundColor") as string;
        const buttonIconColor = formData.get("buttonIconColor") as string;
        const buttonFontColor = formData.get("buttonFontColor") as string;
        const serviceIllustration = formData.get("serviceIllustration") as File | null;

        // Validasi field
        if (!cardBackground) {
            return NextResponse.json(
                { success: false, message: "Card Background is required" },
                { status: 400 }
            );
        } else if (!headerText) {
            return NextResponse.json(
                { success: false, message: "Header Text is required" },
                { status: 400 }
            );
        } else if (!headerTextColor) {
            return NextResponse.json(
                { success: false, message: "Header Text Color is required" },
                { status: 400 }
            );
        } else if (!headerBackgroundColor) {
            return NextResponse.json(
                { success: false, message: "Header Background Color is required" },
                { status: 400 }
            );
        } else if (!buttonIconColor) {
            return NextResponse.json(
                { success: false, message: "Button Icon Color is required" },
                { status: 400 }
            );
        } else if (!buttonFontColor) {
            return NextResponse.json(
                { success: false, message: "Button Font Color is required" },
                { status: 400 }
            );
        } else if (!serviceIllustration) {
            return NextResponse.json(
                { success: false, message: "Service Illustration is required" },
                { status: 400 }
            );
        }

        // Upload foto ke Cloudinary
        const bytes = await serviceIllustration.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await new Promise<{ secure_url: string }>(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        { folder: "service-illustrations" },
                        (error, result) => {
                            if (error || !result) reject(error);
                            else resolve(result);
                        }
                    )
                    .end(buffer);
            }
        );

        // Simpan ke database
        const service = await prisma.service.create({
            data: {
                cardBackground,
                headerText,
                headerTextColor,
                headerBackgroundColor,
                buttonIconColor,
                buttonFontColor,
                serviceIllustration: uploadResult.secure_url, // URL dari Cloudinary
            },
        });

        return NextResponse.json(
            { success: true, data: service },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create service:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create service" },
            { status: 500 }
        );
    }
}