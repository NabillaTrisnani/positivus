import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary, { extractPublicId } from "@/lib/cloudinary";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE TEAM
export async function GET(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const service = await prisma.service.findUnique({
            where: { id: Number(id) },
        });

        if (!service) {
            return NextResponse.json(
                { success: false, message: "Service not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: service });
    } catch (error) {
        console.error("Failed to fetch service", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch service" },
            { status: 500 }
        );
    }
}

// UPDATE TEAM
export async function PUT(req: Request, { params }: Params) {
    try {
        const { id } = await params;

        const formData = await req.formData();

        const serviceIllustration = formData.get("serviceIllustration") as File | null;
        const cardBackground = formData.get("cardBackground") as string;
        const headerText = formData.get("headerText") as string;
        const headerTextColor = formData.get("headerTextColor") as string;
        const headerBackgroundColor = formData.get("headerBackgroundColor") as string;
        const buttonIconColor = formData.get("buttonIconColor") as string;
        const buttonFontColor = formData.get("buttonFontColor") as string;

        // gambar bisa berupa File (baru) atau string URL (lama)
        const imageValue = formData.get("serviceIllustration");
        const isExistingPhoto = typeof imageValue === "string";

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
        } else if (!imageValue) {
            return NextResponse.json(
                { success: false, message: "Service Illustration is required" },
                { status: 400 }
            );
        }

        // Ambil data lama
        const existing = await prisma.service.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Service not found" },
                { status: 404 }
            );
        }

        let serviceIllustrationUrl: string = existing.serviceIllustration;

        if (isExistingPhoto) {
            // Tidak ganti foto — pakai URL lama
            serviceIllustrationUrl = imageValue as string;
        } else {
            // Ada file baru → hapus lama, upload baru
            if (existing.serviceIllustration) {
                const publicId = extractPublicId(existing.serviceIllustration);
                if (publicId) await cloudinary.uploader.destroy(publicId);
            }

            const bytes = await (serviceIllustration as File).arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise<{ secure_url: string }>(
                (resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            { folder: "service-photos" },
                            (error, result) => {
                                if (error || !result) reject(error);
                                else resolve(result);
                            }
                        )
                        .end(buffer);
                }
            );

            serviceIllustrationUrl = uploadResult.secure_url;
        }

        const updatedTeam = await prisma.service.update({
            where: { id: Number(id) },
            data: {
                cardBackground,
                headerText,
                headerTextColor,
                headerBackgroundColor,
                buttonIconColor,
                buttonFontColor,
                serviceIllustration: serviceIllustrationUrl
            },
        });

        return NextResponse.json({ success: true, data: updatedTeam });
    } catch (error) {
        console.error("Failed to update service:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update service" },
            { status: 500 }
        );
    }
}

// DELETE TEAM
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        // Ambil data dulu untuk dapat URL foto
        const existing = await prisma.service.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Service not found" },
                { status: 404 }
            );
        }

        // Hapus foto dari Cloudinary
        if (existing.serviceIllustration) {
            const publicId = extractPublicId(existing.serviceIllustration);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await prisma.service.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true, message: "Service deleted" });
    } catch (error) {
        console.error("Failed to delete service", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete service" },
            { status: 500 }
        );
    }
}