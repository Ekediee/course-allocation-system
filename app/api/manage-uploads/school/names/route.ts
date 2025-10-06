import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server/logger';

export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching school names' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/schools/lists'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching school names failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch school' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching school names successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching school names error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};