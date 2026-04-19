import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/visits/stats - Get visit statistics (Admin)
export const GET = withAuth(
  withErrorHandler(async () => {
    const total = await db.visit.count();
    
    // In Prisma, we use groupBy for distinct counts
    const uniqueResult = await db.visit.groupBy({
      by: ['ip'],
    });

    return NextResponse.json({
      success: true,
      data: {
        total,
        uniqueVisitors: uniqueResult.length
      }
    });
  })
);
