import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

// POST Specialization data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating specialization', specialization: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/specializations/create'), {
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
      logger.error({ message: 'Creating specialization failed', specialization: reqBody, error: data });
      return NextResponse.json({ error: data.error }, { status: res.status });
    }

    logger.info({ message: 'Creating specialization successful', specialization: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Creating specialization error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Specialization data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching specializations' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/specializations/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching specializations failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch specialization' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching specializations successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching specializations error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};