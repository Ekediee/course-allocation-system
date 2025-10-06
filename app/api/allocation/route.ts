import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

// GET Allocation List
export const GET = async (req: NextRequest) => {
  logger.info({  url: req.url, method: req.method, message: 'Fetching allocation list' });
  try {
    const res = await fetch(getBackendApiUrl('/api/v1/allocation/detailed-list'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // cookies are automatically forwarded in browser, but not in Next API routes
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Fetching allocation list failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching allocation list successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching allocation list error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// POST Allocate Course
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({ message: 'Course allocation attempt', allocation: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/allocation/allocate'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Course allocation failed', allocation: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to allocate course' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Course allocation successful', allocation: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Course allocation error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// PUT Update Allocated Course
export const PUT = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({ message: 'Course allocation update attempt', allocation: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/allocation/update'), {
      cache: 'no-store',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errorData = await res.json();
      logger.error({ message: 'Course allocation update failed', allocation: reqBody, error: errorData });
      return NextResponse.json({ error: 'Failed to update allocation' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Course allocation update successful', allocation: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Course allocation update error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};