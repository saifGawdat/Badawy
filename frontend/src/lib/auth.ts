import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = 'badawy_token';

export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);
export const comparePassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

export function signToken(payload: { id: string; username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
}

function getToken(req: NextRequest): string | null {
  // 1. HttpOnly cookie (primary)
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie) return cookie;
  // 2. Bearer header (backward compat)
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export type AuthUser = { id: string; username: string };

type AuthedHandler<P = Record<string, string>> = (
  req: NextRequest,
  ctx: { params: Promise<P> },
  user: AuthUser
) => Promise<NextResponse>;

export function withAuth<P = Record<string, string>>(handler: AuthedHandler<P>) {
  return async (req: NextRequest, ctx: { params: Promise<P> }) => {
    const token = getToken(req);
    if (!token) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }
    try {
      const user = jwt.verify(token, JWT_SECRET) as AuthUser;
      return handler(req, ctx, user);
    } catch {
      return NextResponse.json({ success: false, error: 'Token invalid or expired' }, { status: 401 });
    }
  };
}
