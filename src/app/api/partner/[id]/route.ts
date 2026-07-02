import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import cloudinary, { extractPublicId } from "@/lib/cloudinary";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

// GET SINGLE PARTNER
export async function GET(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        const partner = await prisma.partner.findUnique({
            where: { id: Number(id) },
        });

        if (!partner) {
            return NextResponse.json(
                { success: false, message: "Partner not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: partner });
    } catch (error) {
        console.error("Failed to fetch partner", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch partner" },
            { status: 500 }
        );
    }
}

// UPDATE PARTNER
export async function PUT(req: Request, { params }: Params) {
    try {
        const { id } = await params;

        const formData = await req.formData();

        const logo = formData.get("logo") as File | null;
        const name = formData.get("name") as string;

        // gambar bisa berupa File (baru) atau string URL (lama)
        const imageValue = formData.get("logo");
        const isExistingPhoto = typeof imageValue === "string";

        if (!name) {
            return NextResponse.json(
                { success: false, message: "Partner Name is required" },
                { status: 400 }
            );
        } else if (!imageValue) {
            return NextResponse.json(
                { success: false, message: "Partner Logo is required" },
                { status: 400 }
            );
        }

        // Ambil data lama
        const existing = await prisma.partner.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Partner not found" },
                { status: 404 }
            );
        }

        let partnerLogoUrl: string = existing.logo;

        if (isExistingPhoto) {
            // Tidak ganti foto — pakai URL lama
            partnerLogoUrl = imageValue as string;
        } else {
            // Ada file baru → hapus lama, upload baru
            if (existing.logo) {
                const publicId = extractPublicId(existing.logo);
                if (publicId) await cloudinary.uploader.destroy(publicId);
            }

            const bytes = await (logo as File).arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise<{ secure_url: string }>(
                (resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            { folder: "partner-photos" },
                            (error, result) => {
                                if (error || !result) reject(error);
                                else resolve(result);
                            }
                        )
                        .end(buffer);
                }
            );

            partnerLogoUrl = uploadResult.secure_url;
        }

        const updatedPartner = await prisma.partner.update({
            where: { id: Number(id) },
            data: {
                name,
                logo: partnerLogoUrl
            },
        });

        return NextResponse.json({ success: true, data: updatedPartner });
    } catch (error) {
        console.error("Failed to update partner:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update partner" },
            { status: 500 }
        );
    }
}

// DELETE PARTNER
export async function DELETE(
    req: Request,
    { params }: Params
) {
    try {
        const { id } = await params;

        // Ambil data dulu untuk dapat URL foto
        const existing = await prisma.partner.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Partner not found" },
                { status: 404 }
            );
        }

        // Hapus foto dari Cloudinary
        if (existing.logo) {
            const publicId = extractPublicId(existing.logo);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await prisma.partner.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true, message: "Partner deleted" });
    } catch (error) {
        console.error("Failed to delete partner", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete partner" },
            { status: 500 }
        );
    }
}