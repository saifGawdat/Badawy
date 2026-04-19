import { NextRequest, NextResponse } from 'next/server';
import { withAuth, AuthUser } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/auth/me - Verify session and return user info
export const GET = withAuth(
  withErrorHandler(async (req: NextRequest, ctx: { params: Promise<Record<string, string>> }, user: AuthUser) => {
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
      },
    });
  })
);
