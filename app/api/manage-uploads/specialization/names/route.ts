import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

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
      
      logger.error({ message: 'Fetching specialization names by program failed', program: reqBody, error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch specialization' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching specialization names by program successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching specialization names by program error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};