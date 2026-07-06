import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const isValid = token && (await verifyToken(token));

    if (!isValid && req.nextUrl.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};