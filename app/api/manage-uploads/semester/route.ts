import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

// GET semester data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching semesters' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/semesters/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching semesters failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch semesters' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching semesters successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching semesters error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating semester', semester: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/semesters/create'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const data = await res.json();
      logger.error({ message: 'Creating semester failed', semester: reqBody, error: data });
      return NextResponse.json({ error: data.error || 'Failed to create semester' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Creating semester successful', semester: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Creating semester error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};