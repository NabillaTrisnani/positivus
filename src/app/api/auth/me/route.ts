import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const payload = token && verifyToken(token);

    if (!payload) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: payload });
}