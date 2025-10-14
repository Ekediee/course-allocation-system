import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching admin school names' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/schools/lists/admin'), {
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

      logger.error({ message: 'Fetching admin school names failed', error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch school' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching admin school names successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching admin school names error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};