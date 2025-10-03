import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({ message: 'Creating school', school: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/schools/create'), {
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
      logger.error({ message: 'Creating school failed', school: reqBody, error: data });
      return NextResponse.json({ error: data.error }, { status: res.status });
    }

    logger.info({ message: 'Creating school successful', school: data });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Creating school error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({ message: 'Fetching schools' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/schools/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching schools failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch school' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching schools successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching schools error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};