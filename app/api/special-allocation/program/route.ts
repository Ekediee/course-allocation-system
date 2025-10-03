import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({ message: 'Fetching special allocation programs', body: reqBody });
  try {

    
    const res = await fetch(getBackendApiUrl('/api/v1/programs/department-list'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody)
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching special allocation programs failed', body: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to fetch program' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching special allocation programs successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching special allocation programs error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};