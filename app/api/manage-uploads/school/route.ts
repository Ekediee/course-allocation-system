import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating school', school: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/schools/create'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await res.json();

    let errorData = null;
    if (!res.ok) {
      try {
        errorData = await res.json();
      } catch {
        errorData = {};
      }

      // Check if token expired
      const authError = handleAuthError(res, errorData);
      if (authError) return authError; // auto-clears cookies

      logger.error({ message: 'Creating school failed', school: reqBody, error: errorData });
      return NextResponse.json({ error: errorData.error }, { status: res.status });
    }

    logger.info({ message: 'Creating school successful', school: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Creating school error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({ message: 'Fetching schools' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/schools/list'), {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    let errorData = null;
    if (!res.ok) {
      try {
        errorData = await res.json();
      } catch {
        errorData = {};
      }

      // Check if token expired
      const authError = handleAuthError(res, errorData);
      if (authError) return authError; // auto-clears cookies
      logger.error({ message: 'Fetching schools failed', error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch school' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching schools successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching schools error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};