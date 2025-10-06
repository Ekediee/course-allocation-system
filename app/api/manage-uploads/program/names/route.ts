import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Fetching program names by department', department: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/programs/names/list'), {
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
      logger.error({ message: 'Fetching program names by department failed', department: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to fetch department' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching program names by department successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching program names by department error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};