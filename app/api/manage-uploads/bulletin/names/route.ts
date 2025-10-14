import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

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
      
      logger.error({ message: 'Fetching bulletin names failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch bulletin' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching bulletin names successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching bulletin names error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};