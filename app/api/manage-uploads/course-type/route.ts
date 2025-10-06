import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

// POST Course Type data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating course type', courseType: reqBody });
  try {

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
      logger.error({ message: 'Creating course type failed', courseType: reqBody, error: data });
      return NextResponse.json({ error: data.error || 'Server error' }, { status: res.status });
    }

    logger.info({ message: 'Creating course type successful', courseType: data });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Creating course type error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Course Type data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching course types' });
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
        logger.error({ message: 'Fetching course types failed', error: data });
        return NextResponse.json({ error: data.error || 'Failed to fetch course types' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching course types successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching course types error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};