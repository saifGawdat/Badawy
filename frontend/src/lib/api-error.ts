import { NextResponse } from 'next/server';

export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function withErrorHandler(handler: Function) {
  return async (...args: unknown[]) => {
    try {
      return await handler(...args);
    } catch (err: any) {
      console.error('🔥 API Error:', err);

      // Prisma unique constraint
      if (err.code === 'P2002') {
        return apiError(`Duplicate value: ${err.meta?.target?.join(', ')}`, 400);
      }
      // Prisma record not found
      if (err.code === 'P2025') {
        return apiError('Record not found', 404);
      }
      // Prisma invalid ID format
      if (err.code === 'P2023') {
        return apiError('Invalid ID format', 400);
      }

      return apiError(err.message || 'Server error', err.statusCode || 500);
    }
  };
}
