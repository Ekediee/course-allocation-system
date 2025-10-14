import { NextResponse } from 'next/server';

export function handleAuthError(
  res: Response,
  errorData?: any
): NextResponse | null {
  // Detect common auth expiration patterns
  if (
    res.status === 401 ||
    errorData?.msg?.toLowerCase().includes('token has expired') ||
    errorData?.detail?.toLowerCase().includes('token expired')
  ) {
    // Clear authentication cookies
    const response = NextResponse.json(
      { error: 'Session expired. Please log in again.' },
      { status: 401 }
    );

    response.cookies.set('access_token_cookie', '', { maxAge: 0, path: '/' });
    response.cookies.set('role', '', { maxAge: 0, path: '/' });
    response.cookies.set('email', '', { maxAge: 0, path: '/' });
    response.cookies.set('name', '', { maxAge: 0, path: '/' });
    response.cookies.set('department', '', { maxAge: 0, path: '/' });

    return response;
  }

  return null;
}
