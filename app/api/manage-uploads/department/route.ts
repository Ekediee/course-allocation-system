import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';
import { error } from 'console';

// POST Session data
export const POST = async (req: NextRequest) => {
  const reqBody = await req.json();
  logger.info({url: req.url, method: req.method, message: 'Creating department', department: reqBody });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/departments/create'), {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await res.json();

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
      
      logger.error({ message: 'Creating department failed', department: reqBody, error: errorData });
      return NextResponse.json({ error: errorData.error }, { status: res.status });
    }

    logger.info({ message: 'Creating department successful', department: data });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Creating department error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  logger.info({url: req.url, method: req.method, message: 'Fetching departments' });
  try {

    const res = await fetch(getBackendApiUrl('/api/v1/departments/list'), {
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

      logger.error({ message: 'Fetching departments failed', error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch department' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching departments successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Fetching departments error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// PUT department data
export const PUT = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const reqBody = await req.json();
    logger.info({url: req.url, method: req.method, message: 'Updating department', department: reqBody });
    try {
  
      const res = await fetch(getBackendApiUrl(`/api/v1/departments/update/${id}`), {
        cache: 'no-store',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Cookie: req.headers.get('cookie') || '',
        },
        body: JSON.stringify(reqBody),
      });
  
      const data = await res.json();
  
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

        logger.error({ message: 'Updating department failed', department: reqBody, error: errorData });
        return NextResponse.json({ error: errorData.error }, { status: res.status });
      }
  
      logger.info({ message: 'Updating department successful', department: data });
      return NextResponse.json(data);
    } catch (err) {
      logger.error({ err }, 'Updating department error');
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  };

  // DELETE department data
export const DELETE = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    logger.info({url: req.url, method: req.method, message: 'Deleting department', departmentId: id });
    try {
  
      const res = await fetch(getBackendApiUrl(`/api/v1/departments/delete/${id}`), {
        cache: 'no-store',
        method: 'DELETE',
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

        logger.error({ message: 'Deleting department failed', departmentId: id, error: errorData });
        return NextResponse.json({ error: errorData.error || 'Failed to delete department' }, { status: res.status });
      }
  
      logger.info({ message: 'Deleting department successful', departmentId: id });
      return NextResponse.json({ message: 'Department deleted successfully' });
    } catch (err) {
      logger.error({ err }, 'Deleting department error');
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  };