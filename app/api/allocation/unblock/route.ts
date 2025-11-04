import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  
  logger.info({url: req.url, method: req.method, message: 'Unblocking Allocation', body });
  try {
    
    if (!body.department_id || !body.semester_id) {
      logger.error({ message: 'Unblocking Allocation failed', error: 'Missing required body parameters', body });
      return NextResponse.json({ title: 'Unblocking Allocation failed', error: 'Missing required body parameters' }, { status: 400 });
    }

    const url = getBackendApiUrl(`/api/v1/allocation/unblock`);

    const res = await fetch(url, {
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

      logger.error({ message: 'Unblocking Allocation failed', body, error: errorData });
      return NextResponse.json({ 
        title: 'Unblocking Allocation failed', 
        error: errorData.error || 'Unblocking Allocation failed', 
        details: errorData }, 
        { status: res.status}
      );
    }

    const data = await res.json();
    logger.info({ message: 'Unblocking Allocation successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Unblocking Allocation error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};