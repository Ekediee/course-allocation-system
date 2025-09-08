import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';

// GET request to fetch all users
export const GET = async (req: any) => {
  try {
    const res = await fetch(getBackendApiUrl('/api/v1/users'), {
      cache: 'no-store',
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST request to create a new user
export const POST = async (req: any) => {
    try {
        const body = await req.json();
        const res = await fetch(getBackendApiUrl('/api/v1/users'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.error || 'Failed to create user' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}