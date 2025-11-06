import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const GET = async (req: Request) => {
    logger.info({url: req.url, method: req.method, message: 'Fetching courses' });
    try {
        const res = await fetch(getBackendApiUrl('/api/v1/courses/main'), {
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

// PUT handler for updating a course
export const PUT = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const reqBody = await req.json();
    logger.info({url: req.url, method: req.method, message: `Course update attempt for id: ${id}`, course: reqBody });

    try {
        const res = await fetch(getBackendApiUrl(`/api/v1/courses/main/${id}`), {
            method: 'PUT',
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

            const authError = handleAuthError(res, errorData);
            if (authError) return authError;

            logger.error({ message: `Course update failed for id: ${id}`, course: reqBody, error: errorData });
            return NextResponse.json({ title: 'Course update failed', error: errorData.error || 'Failed to update course' }, { status: res.status });
        }

        const data = await res.json();
        logger.info({ message: `Course update successful for id: ${id}`, course: data });
        return NextResponse.json(data);

    } catch (err) {
        logger.error({ err }, `Course update error for id: ${id}`);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

