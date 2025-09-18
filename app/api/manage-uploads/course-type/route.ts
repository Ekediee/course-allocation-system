import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

// POST Course Type data
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();

    const res = await fetch(getBackendApiUrl('/api/v1/course-types/create'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || 'Server error' }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("POST course-type error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Course Type data
export const GET = async (req: NextRequest) => {
  try {
    const res = await fetch(getBackendApiUrl('/api/v1/course-types/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
        const data = await res.json();
        return NextResponse.json({ error: data.error || 'Failed to fetch course types' }, { status: res.status });
    }

    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET course-types error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};