import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const GET = async (req: Request) => {
    logger.info({url: req.url, method: req.method, message: 'Fetching courses' });
    try {
        const res = await fetch(getBackendApiUrl('/api/v1/courses/main/list'), {
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

          logger.error({ message: 'Fetching courses failed', error: errorData });
          return NextResponse.json({ error: errorData.error || 'Failed to fetch courses' }, { status: res.status });
        }

        const data = await res.json();
        logger.info({ message: 'Fetching courses successful' });
        return NextResponse.json(data);

    } catch (error) {
        logger.error({ message: 'Fetching courses error', error });
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}