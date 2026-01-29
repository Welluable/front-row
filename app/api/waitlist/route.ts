import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/prisma";

// Config
const MIN_SUBMIT_MS = 2000;
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

// Rate limiting (in-memory)
const rateStore = new Map<string, { count: number; resetAt: number }>();

function checkRate(key: string) {
  const now = Date.now();
  const entry = rateStore.get(key);
  if (!entry || now > entry.resetAt) {
    rateStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { ok: true };
}

function hashIp(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() 
    ?? req.headers.get("x-real-ip") ?? "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? "").trim();
    const loadedAt = body?._loadedAt ?? 0;
    const submittedAt = body?._t ?? 0;

    // Bot checks
    if (body?._hp) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    if (loadedAt && submittedAt && submittedAt - loadedAt < MIN_SUBMIT_MS) {
      return NextResponse.json({ error: "Too fast" }, { status: 429 });
    }

    // Validation
    if (!EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Rate limit
    const ipHash = hashIp(req);
    const rate = checkRate(ipHash);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "Too many attempts" },
        { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
      );
    }

    // Save
    await prisma.waitlistEntry.create({
      data: { email, ipHash, source: body?.source ?? null },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if ((err as { code?: string })?.code === "P2002") {
      return NextResponse.json({ error: "Already on waitlist" }, { status: 409 });
    }
    console.error("Waitlist error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
