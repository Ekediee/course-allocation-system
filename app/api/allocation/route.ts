import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

// GET Allocation List
export const GET = async (req: NextRequest) => {
  try {
    const res = await fetch(getBackendApiUrl('/api/v1/allocation/detailed-list'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // cookies are automatically forwarded in browser, but not in Next API routes
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET allocation error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// POST Allocate Course
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();

    const res = await fetch(getBackendApiUrl('/api/v1/allocation/allocate'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to allocate course' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST allocation error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};