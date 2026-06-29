import { prisma } from "@/lib/prisma";
import { paginate } from "@/lib/pagination";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// GET ALL TEAM (paginated + searchable)
export async function GET(req: Request) {
    try {
        const result = await paginate(prisma.team, req, {
            searchFields: ["name", "position", "description"],
        });

        return NextResponse.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Failed to fetch teams:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch teams",
            },
            { status: 500 }
        );
    }
}

// CREATE TEAM
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const file = formData.get("photo") as File | null;
        const name = formData.get("name") as string;
        const position = formData.get("position") as string;
        const description = formData.get("description") as string;
        const linkedin = formData.get("linkedin") as string;

        // Validasi field
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
        } else if (!file) {
            return NextResponse.json(
                { success: false, message: "Photo is required" },
                { status: 400 }
            );
        }

        // Upload foto ke Cloudinary
        const bytes = await file.arrayBuffer();
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

        // Simpan ke database
        const team = await prisma.team.create({
            data: {
                name,
                position,
                description,
                photo: uploadResult.secure_url, // URL dari Cloudinary
                linkedin,
            },
        });

        return NextResponse.json(
            { success: true, data: team },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create team:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create team" },
            { status: 500 }
        );
    }
}