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

export const POST = async (req: Request) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Linking Course to Program', course: reqBody });

  try {
    const res = await fetch(getBackendApiUrl('/api/v1/courses/link_program_course'), {
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

      logger.error({ message: 'Linking Course to Program failed', course: reqBody, error: errorData });
      return NextResponse.json({ title: 'Linking Course to Program failed', error: errorData.error || 'Failed to create course' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Linking Course to Program successful', course: data });
    return NextResponse.json(data);

  } catch (err) {
    logger.error({ err }, 'Linking Course to Program error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE handler for deleting a course
export const DELETE = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    logger.info({url: req.url, method: req.method, message: `Course delete attempt for id: ${id}` });

    try {
        const res = await fetch(getBackendApiUrl(`/api/v1/courses/main/${id}`), {
            method: 'DELETE',
            headers: {
                Cookie: req.headers.get('cookie') || '',
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            let errorData: any;

            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                // If parsing fails, use the raw text as the error message.
                errorData = { error: errorText || 'Server returned an empty error response.' };
            }

            const authError = handleAuthError(res, errorData);
            if (authError) return authError;
            console.log('Error data:', errorData);
            logger.error({ message: `Course delete failed for id: ${id}`, error: errorData });
            return NextResponse.json({ error: errorData.error || 'Failed to delete course' }, { status: res.status });
        }

        logger.info({ message: `Course delete successful for id: ${id}` });
        return new Response(null, { status: 204 });

    } catch (err) {
        logger.error({ err }, `Course delete error for id: ${id}`);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

