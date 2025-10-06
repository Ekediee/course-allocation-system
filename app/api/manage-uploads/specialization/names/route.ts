import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Fetching specialization names by program', program: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/specializations/names/list'), {
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
      logger.error({ message: 'Fetching specialization names by program failed', program: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to fetch specialization' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching specialization names by program successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching specialization names by program error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};