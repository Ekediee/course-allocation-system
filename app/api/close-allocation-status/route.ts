import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  
  logger.info({url: req.url, method: req.method, message: 'Setting allocation close status', body });
  try {

    const url = getBackendApiUrl(`/api/v1/admin/close-allocation`);

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

      logger.error({ message: 'Setting allocation close status failed', body, error: errorData });
      return NextResponse.json({ error: errorData.error || 'Failed to fetch data', details: errorData }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Setting allocation close status successful' });
    return NextResponse.json(data);
  } catch (err) {
    logger.error({ err }, 'Setting allocation close status error');
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

export async function GET(req: NextRequest) {
    logger.info({ url: req.url, method: req.method }, 'Fetching allocation close status');
    try {
        const response = await fetch(getBackendApiUrl(`/api/v1/admin/close-allocation`), {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            }
        });

        if (response.ok) {
            const data = await response.json();
            logger.info({ message: 'Fetching allocation close status successful' });
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
            logger.error({ message: 'Fetching allocation close status failed', error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (err) {
        logger.error({ err }, 'Fetching allocation close status error');
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}