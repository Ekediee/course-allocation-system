import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

// POST Session data
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();

    const res = await fetch(getBackendApiUrl('/api/v1/bulletins/create'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to activate bulletin' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST bulletin error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/bulletins/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch bulletin' }, { status: res.status });
    }

    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};