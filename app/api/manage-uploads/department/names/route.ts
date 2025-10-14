import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Fetching department names by school', school: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/departments/names/list'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
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
      
      logger.error({ message: 'Fetching department names by school failed', school: reqBody, error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch department' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching department names by school successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching department names by school error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching all department names' });
  try {
  

    const res = await fetch(getBackendApiUrl('/api/v1/departments/lists'), {
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

      logger.error({ message: 'Fetching all department names failed', error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch department' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching all department names successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching all department names error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};