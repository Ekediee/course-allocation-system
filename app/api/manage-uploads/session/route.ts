import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating session', session: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/sessions/init'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Creating session failed', session: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to activate session' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Creating session successful', session: data });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Creating session error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching active session' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/sessions/active'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching active session failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch session' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching active session successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching active session error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};