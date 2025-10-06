import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating department', department: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/departments/create'), {
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
      logger.error({ message: 'Creating department failed', department: reqBody, error: data });
      return NextResponse.json({ error: data.error }, { status: res.status });
    }

    logger.info({ message: 'Creating department successful', department: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Creating department error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching departments' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/departments/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching departments failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch department' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching departments successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching departments error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};