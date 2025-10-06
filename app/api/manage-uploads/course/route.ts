import { getBackendApiUrl } from '@/lib/api';
import { NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

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

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Course creation failed', course: reqBody, error: errorData });
      return NextResponse.json({ error: errorData.msg || 'Failed to create course' }, { status: res.status });
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

        if (!res.ok) {
            const errorData = await res.json();
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