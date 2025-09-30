import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function checks if the JWT token is expired
// It decodes the token and checks the 'exp' field
const isTokenExpired = (token: string): boolean => {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
    if (!payload.exp) return true;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token_cookie')?.value;
  const role = request.cookies.get('role')?.value;

  const url = request.nextUrl.clone();

  if (!token || isTokenExpired(token)) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  // restrict routes
  if (url.pathname.startsWith('/dashboard/superadmin') && role !== 'superadmin') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if ((url.pathname.startsWith('/dashboard/hod') || url.pathname.startsWith('/course-allocation') || url.pathname.startsWith('/special-allocation/')) && role !== 'hod') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if ((url.pathname.startsWith('/vetter/manage-uploads') ||
      url.pathname.startsWith('/vetter/manage-uploads') || 
      url.pathname.startsWith('/dashboard/vetter')) && 
      role !== 'vetter') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*',
    '/course-allocation/:path*',
    '/vetter/:path*', '/special-allocation/:path*'
  ],
};
