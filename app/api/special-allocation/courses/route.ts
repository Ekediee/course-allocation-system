import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    
    if (!body.bulletin || !body.program || !body.semester) {
      return NextResponse.json({ error: 'Missing required body parameters' }, { status: 400 });
    }

    const url = getBackendApiUrl(`/api/v1/allocation/courses-by-bulletin`);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: 'Failed to fetch data', details: errorData }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST special allocation courses error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};