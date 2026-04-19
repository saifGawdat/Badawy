import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// Helper to get client IP in Next.js
const getClientIp = (req: NextRequest) => {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
};

// POST /api/visits - Track a visit
export const POST = withErrorHandler(async (req: NextRequest) => {
  const ip = getClientIp(req);
  const { path: pathBody, userAgent } = await req.json().catch(() => ({}));
  
  const path = typeof pathBody === "string" && pathBody.trim()
    ? pathBody.trim().slice(0, 500)
    : "/";
  const ua = typeof userAgent === "string" ? userAgent.slice(0, 1000) : "";

  await db.visit.create({
    data: { ip, path, userAgent: ua }
  });

  return NextResponse.json({ success: true, ip }, { status: 201 });
});

// GET /api/visits - Get visit logs (Admin)
export const GET = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "100"), 1), 500);
    const skip = Math.max(parseInt(searchParams.get("skip") || "0"), 0);

    const visits = await db.visit.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    });

    return NextResponse.json({
      success: true,
      count: visits.length,
      data: visits
    });
  })
);
