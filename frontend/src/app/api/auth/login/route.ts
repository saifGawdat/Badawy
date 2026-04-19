import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { withErrorHandler, apiError } from '@/lib/api-error';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { username, password } = await req.json();

  if (!username || !password) {
    return apiError('Please provide a username and password', 400);
  }

  // Check for user
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    return apiError('Invalid credentials', 401);
  }

  // Check if password matches
  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    return apiError('Invalid credentials', 401);
  }

  // Create token
  const token = signToken({ id: user.id, username: user.username });

  const response = NextResponse.json({
    success: true,
    id: user.id,
    username: user.username,
  });

  // Set HttpOnly cookie
  setAuthCookie(response, token);

  return response;
});
