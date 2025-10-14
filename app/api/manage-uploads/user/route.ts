import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

// GET request to fetch all users
export const GET = async (req: any) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching all users' });
  try {
    const res = await fetch(getBackendApiUrl('/api/v1/users'), {
      cache: 'no-store',
      method: "GET",
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

      logger.error({ message: 'Fetching all users failed', error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching all users successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching all users error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST request to create a new user
export const POST = async (req: any) => {
    const body = await req.json();
    logger.info({ message: 'User creation attempt', user: body });
    try {
        const res = await fetch(getBackendApiUrl('/api/v1/users'), {
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

            logger.error({ message: 'User creation failed', user: body, error: errorData });
            return NextResponse.json({ error: errorData.error || 'Failed to create user' }, { status: res.status });
        }

        const data = await res.json();
        logger.info({ message: 'User creation successful', user: data });
        return NextResponse.json(data);
    } catch (err) {
        logger.error({ err }, 'User creation error');
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}