import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const res = NextResponse.redirect(new URL('/', request.url));
  ['access_token_cookie', 'role', 'name', 'email', 'department'].forEach(name =>
    res.cookies.set(name, '', { path: '/', maxAge: 0 })
  );
  return res;
};