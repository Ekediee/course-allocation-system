import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Fetching special allocation courses', body });
  try {
    
    if (!body.bulletin || !body.program || !body.semester) {
      logger.error({ message: 'Fetching special allocation courses failed', error: 'Missing required body parameters', body });
      return NextResponse.json({ error: 'Missing required body parameters' }, { status: 400 });
    }

    const url = getBackendApiUrl(`/api/v1/allocation/courses-by-bulletin`);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
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

      logger.error({ message: 'Fetching special allocation courses failed', body, error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch data', details: errorData }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching special allocation courses successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching special allocation courses error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};