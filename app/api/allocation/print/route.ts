import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

// POST Allocate Course
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({ message: 'Fetching Course allocation for printing', allocation: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/allocation/print'), {
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

      logger.error({ message: 'Course allocation printing failed', allocation: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to printing allocation courses' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Course allocation printing successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Course allocation printing error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};