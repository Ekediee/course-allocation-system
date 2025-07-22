import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token_cookie')?.value;
  const role = request.cookies.get('role')?.value;

  const url = request.nextUrl.clone();

  if (!token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // restrict routes
  if (url.pathname.startsWith('/dashboard/superadmin') && role !== 'superadmin') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if ((url.pathname.startsWith('/dashboard/hod') || url.pathname.startsWith('/course-allocation')) && role !== 'hod') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith('/vetter/manage-uploads') && role !== 'vetter') {
    url.pathname = '/unauthorized';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*',
    '/course-allocation/:path*',
    '/vetter/manage-uploads'
  ],
};
