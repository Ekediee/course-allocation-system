import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating program', program: reqBody });
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

      logger.error({ message: 'Creating program failed', program: reqBody, error: errorData });
      return NextResponse.json({ error: errorData.error }, { status: res.status });
    }

    logger.info({ message: 'Creating program successful', program: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Creating program error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching programs' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/programs/list'), {
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

      logger.error({ message: 'Fetching programs failed', error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch program' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching programs successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching programs error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};