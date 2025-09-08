import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/departments/list/admin'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch department' }, { status: res.status });
    }

    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};