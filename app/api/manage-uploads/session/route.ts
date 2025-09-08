import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

// POST Session data
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();

    const res = await fetch(getBackendApiUrl('/api/v1/sessions/init'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to activate session' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST session error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/sessions/active'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch session' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};