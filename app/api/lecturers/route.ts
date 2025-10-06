import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/logger';

export const GET = async (req: any) => {
  logger.info({  url: req.url, method: req.method, message: 'Fetching lecturers' });
  try {
    const res = await fetch(getBackendApiUrl('/api/v1/allocation/allocate/lecturers'), {
      cache: 'no-store', // prevent caching for fresh data
      method: "GET",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching lecturers failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching lecturers successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching lecturers error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}