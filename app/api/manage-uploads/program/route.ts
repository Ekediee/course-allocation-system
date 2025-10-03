import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({ message: 'Creating program', program: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/programs/create'), {
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
      logger.error({ message: 'Creating program failed', program: reqBody, error: data });
      return NextResponse.json({ error: data.error }, { status: res.status });
    }

    logger.info({ message: 'Creating program successful', program: data });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Creating program error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({ message: 'Fetching programs' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/programs/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching programs failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch program' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching programs successful' });
    return NextResponse.json(data);
  } catch (error) {
    logger.error({ message: 'Fetching programs error', error });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};