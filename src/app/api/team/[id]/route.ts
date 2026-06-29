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

        const team = await prisma.team.findUnique({
            where: { id: Number(id) },
        });

        if (!team) {
            return NextResponse.json(
                { success: false, message: "Team not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: team });
    } catch (error) {
        console.error("Failed to fetch team", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch team" },
            { status: 500 }
        );
    }
}

// UPDATE TEAM
export async function PUT(req: Request, { params }: Params) {
    try {
        const { id } = await params;

        const formData = await req.formData();

        const file = formData.get("photo") as File | null;
        const name = formData.get("name") as string;
        const position = formData.get("position") as string;
        const description = formData.get("description") as string;
        const linkedin = formData.get("linkedin") as string;

        // photo bisa berupa File (baru) atau string URL (lama)
        const photoValue = formData.get("photo");
        const isExistingPhoto = typeof photoValue === "string";

        if (!name) {
            return NextResponse.json(
                { success: false, message: "Name is required" },
                { status: 400 }
            );
        } else if (!position) {
            return NextResponse.json(
                { success: false, message: "Position is required" },
                { status: 400 }
            );
        } else if (!description) {
            return NextResponse.json(
                { success: false, message: "Description is required" },
                { status: 400 }
            );
        } else if (!photoValue) {
            return NextResponse.json(
                { success: false, message: "Photo is required" },
                { status: 400 }
            );
        }

        // Ambil data lama
        const existing = await prisma.team.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Team not found" },
                { status: 404 }
            );
        }

        let photoUrl: string = existing.photo;

        if (isExistingPhoto) {
            // Tidak ganti foto — pakai URL lama
            photoUrl = photoValue as string;
        } else {
            // Ada file baru → hapus lama, upload baru
            if (existing.photo) {
                const publicId = extractPublicId(existing.photo);
                if (publicId) await cloudinary.uploader.destroy(publicId);
            }

            const bytes = await (file as File).arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise<{ secure_url: string }>(
                (resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            { folder: "team-photos" },
                            (error, result) => {
                                if (error || !result) reject(error);
                                else resolve(result);
                            }
                        )
                        .end(buffer);
                }
            );

            photoUrl = uploadResult.secure_url;
        }

        const updatedTeam = await prisma.team.update({
            where: { id: Number(id) },
            data: { name, position, description, photo: photoUrl, linkedin },
        });

        return NextResponse.json({ success: true, data: updatedTeam });
    } catch (error) {
        console.error("Failed to update team:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update team" },
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
        const existing = await prisma.team.findUnique({
            where: { id: Number(id) },
        });

        if (!existing) {
            return NextResponse.json(
                { success: false, message: "Team not found" },
                { status: 404 }
            );
        }

        // Hapus foto dari Cloudinary
        if (existing.photo) {
            const publicId = extractPublicId(existing.photo);
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await prisma.team.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true, message: "Team deleted" });
    } catch (error) {
        console.error("Failed to delete team", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete team" },
            { status: 500 }
        );
    }
}