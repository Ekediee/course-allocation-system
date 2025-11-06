import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  
  logger.info({url: req.url, method: req.method, message: 'Setting maintenance status', body });
  try {
    
    // if (!body.enable) {
    //   logger.error({ message: 'Setting maintenance status failed', error: 'Missing required body parameters', body });
    //   return NextResponse.json({ error: 'Missing required body parameters' }, { status: 400 });
    // }

    const url = getBackendApiUrl(`/api/v1/admin/maintenance-mode`);

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

      logger.error({ message: 'Setting maintenance status failed', body, error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch data', details: errorData }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Setting maintenance status successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Setting maintenance status error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

export async function GET(req: NextRequest) {
    logger.info({ url: req.url, method: req.method }, 'Fetching maintenance status');
    try {
        const response = await fetch(getBackendApiUrl(`/api/v1/admin/maintenance-status`), {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            }
        });

        if (response.ok) {
            const data = await response.json();
            logger.info({ message: 'Fetching maintenance status successful' });
            return NextResponse.json(data, { status: 201 });
        } else {
            let errorData = null;
            try {
                errorData = await response.json();
            } catch {
                errorData = {};
            }
    
            // Check if token expired
            const authError = handleAuthError(response, errorData);
            if (authError) return authError; // auto-clears cookies
            logger.error({ message: 'Fetching maintenance status failed', error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (err) {
        logger.error({ err }, 'Fetching maintenance status error');
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}