import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from '@/lib/logger';

export const GET = async (request: NextRequest) => {
  const name = request.cookies.get('name')?.value;
  logger.info({ message: 'Logout successful', user: name });
  const res = NextResponse.redirect(new URL('/', request.url));
  ['access_token_cookie', 'role', 'name', 'email', 'department'].forEach(name =>
    res.cookies.set(name, '', { path: '/', maxAge: 0 })
  );
  return res;
};