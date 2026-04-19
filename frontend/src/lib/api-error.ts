import { NextResponse } from 'next/server';

export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler<T extends any[]> = (...args: T) => Promise<NextResponse>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler<T extends any[]>(handler: Handler<T>) {
  return async (...args: T) => {
    try {
      return await handler(...args);
    } catch (err: unknown) {
      console.error('🔥 API Error:', err);

      const error = err as { code?: string; message?: string; statusCode?: number; meta?: { target?: string[] } };

      // Prisma unique constraint
      if (error.code === 'P2002') {
        return apiError(`Duplicate value: ${error.meta?.target?.join(', ')}`, 400);
      }
      // Prisma record not found
      if (error.code === 'P2025') {
        return apiError('Record not found', 404);
      }
      // Prisma invalid ID format
      if (error.code === 'P2023') {
        return apiError('Invalid ID format', 400);
      }

      return apiError(error.message || 'Server error', error.statusCode || 500);
    }
  };
}
