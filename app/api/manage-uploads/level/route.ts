import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

// GET level data
export const GET = async (req: NextRequest) => {
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/levels/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch levels' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};