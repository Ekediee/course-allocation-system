import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching bulletin names' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/bulletins/list/name'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching bulletin names failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch bulletin' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching bulletin names successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching bulletin names error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};