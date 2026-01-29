import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

/**
 * Verifies admin auth. Supports:
 * - Bearer "email:password" -> database user lookup and bcrypt compare
 * - Bearer "password" (no colon) -> legacy ADMIN_PASSWORD env fallback
 */
async function verifyAdmin(req: NextRequest): Promise<boolean> {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7).trim();
  const colonIndex = token.indexOf(":");
  if (colonIndex !== -1) {
    const email = token.slice(0, colonIndex).trim().toLowerCase();
    const password = token.slice(colonIndex + 1);
    if (!email || !password) return false;
    const user = await prisma.user.findUnique({
      where: { email },
      select: { passwordHash: true, role: true },
    });
    if (!user || user.role !== "admin") return false;
    return bcrypt.compare(password, user.passwordHash);
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return token === expected;
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const entries = await prisma.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, createdAt: true },
    });
    return NextResponse.json(entries);
  } catch (err) {
    console.error("Admin GET users error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = typeof body?.id === "string" ? body.id.trim() : null;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await prisma.waitlistEntry.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    console.error("Admin DELETE user error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
