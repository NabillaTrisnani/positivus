import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
    }

    const token = await signToken({ id: user.id, email: user.email });

    const res = NextResponse.json({ message: "Login berhasil", user: { id: user.id, email: user.email } });
    res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    return res;
}