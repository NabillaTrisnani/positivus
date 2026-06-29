// lib/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper: ekstrak public_id dari URL Cloudinary
// contoh URL: https://res.cloudinary.com/demo/image/upload/v123/team-photos/abc123.jpg
// public_id-nya: team-photos/abc123
export function extractPublicId(url: string): string | null {
    try {
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}