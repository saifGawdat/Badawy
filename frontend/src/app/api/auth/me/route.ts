import { NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/auth/me - Verify session and return user info
export const GET = withAuth(
  withErrorHandler(async (req: any, ctx: any, user: { id: string; username: string }) => {
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
      },
    });
  })
);
