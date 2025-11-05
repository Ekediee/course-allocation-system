import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

// POST handler for creating a new course
export const POST = async (req: Request) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Course creation attempt', course: reqBody });

  try {
    const res = await fetch(getBackendApiUrl('/api/v1/courses'), {
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

      logger.error({ message: 'Course creation failed', course: reqBody, error: errorData });
      return NextResponse.json({ title: 'Course creation failed', error: errorData.error || 'Failed to create course' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Course creation successful', course: data });
    return NextResponse.json(data);

  } catch (err) {
    logger.error({ err }, 'Course creation error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET handler for fetching all courses
export const GET = async (req: Request) => {
    logger.info({url: req.url, method: req.method, message: 'Fetching courses' });
    try {
        const res = await fetch(getBackendApiUrl('/api/v1/courses'), {
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
        const res = await fetch(getBackendApiUrl(`/api/v1/courses/${id}`), {
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

// DELETE handler for deleting a course
export const DELETE = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    logger.info({url: req.url, method: req.method, message: `Course delete attempt for id: ${id}` });

    try {
        const res = await fetch(getBackendApiUrl(`/api/v1/courses/${id}`), {
            method: 'DELETE',
            headers: {
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