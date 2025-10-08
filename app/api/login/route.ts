import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

export const POST = async (req: any) => {

  const reqBody = await req.json()
  logger.info({  url: req.url, method: req.method, message: 'Login attempt', email: reqBody.email });

  try {
    const res = await fetch(getBackendApiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Login failed', email: reqBody.email, error: errorData });
      return NextResponse.json({ error: errorData.msg || 'Login Failed' }, { status: res.status });
    }

    const data = await res.json();
    const user = {
      name: data.user.name,
      role: data.user.role,
      department: data.user.department,
      email: data.user.email,
    }
    
    logger.info({ message: 'Login successful', user });
    const response = NextResponse.json({
      user,
      message: 'Login successful' 
    });

    response.cookies.set('access_token_cookie', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });

    response.cookies.set('name', user.name, {
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set('role', user.role, {
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set('department', user.department, {
      path: '/',
      sameSite: 'lax',
    });
    response.cookies.set('email', user.email, {
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (err: any) {
    try {
      logger.error({
        message: 'Login error',
        type: typeof err,
        instanceOfError: err instanceof Error,
        name: err?.name,
        msg: err?.message,
        stack: err?.stack,
        stringified: JSON.stringify(err, Object.getOwnPropertyNames(err)),
      });
    } catch (logErr) {
      console.error('Failed to log error properly:', logErr);
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
//   return NextResponse.json(reqBody);
}