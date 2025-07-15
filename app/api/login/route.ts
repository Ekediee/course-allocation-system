import { NextResponse } from 'next/server';

export const POST = async (req: any) => {

  const reqBody = await req.json()

  try {
    const res = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Login Failed' }, { status: 500 });
    }

    const data = await res.json();
    // console.log("fetched allocation: ", data)
    // const resp = NextResponse.json({ message: 'Login successful' });
    const resp = new NextResponse(
      JSON.stringify({ message: 'Login successful' }), // plain JSON
      { status: 200 }
    );
    resp.cookies.set('access_token_cookie', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });
    resp.cookies.set('role', data.user.role, {
        httpOnly: false, // Allow client-side access to role
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });
    resp.cookies.set('name', data.user.name, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });
    resp.cookies.set('department', data.user.department, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });
    resp.cookies.set('email', data.user.email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
    });

    return resp;
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
//   return NextResponse.json(reqBody);
}