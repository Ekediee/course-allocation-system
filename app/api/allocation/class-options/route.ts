import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const POST = async (req: any) => {
    const reqBody =  await req.json();
  logger.info({  url: req.url, method: req.method, message: 'Fetching class options' });
  try {
    const res = await fetch(getBackendApiUrl('/api/v1/allocation/class-options'), {
      cache: 'no-store', // prevent caching for fresh data
      method: "GET",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
        'X-UMIS-Token': reqBody.utoken,
        'X-UMIS-id': reqBody.uid,
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

      logger.error({ message: 'Fetching class options failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching class options successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching class options error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}