import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating bulletin', bulletin: reqBody });
  try {

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
      const errorData = await res.json();
      logger.error({ message: 'Creating bulletin failed', bulletin: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to activate bulletin' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Creating bulletin successful', bulletin: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Creating bulletin error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching bulletins' });
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
      const errorData = await res.json();
      logger.error({ message: 'Fetching bulletins failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch bulletin' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching bulletins successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching bulletins error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};