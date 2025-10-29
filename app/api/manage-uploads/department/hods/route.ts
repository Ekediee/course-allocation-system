import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export async function GET(req: NextRequest) {
    logger.info({ url: req.url, method: req.method }, 'Fetching departments and HODs');
    try {
        const response = await fetch(getBackendApiUrl(`/api/v1/departments/departments-by-semester`), {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            }
        });

        if (response.ok) {
            const data = await response.json();
            logger.info({ message: 'Fetching departments and HODs successful' });
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
            logger.error({ message: 'Fetching departments and HODs failed', error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (err) {
        logger.error({ err }, 'Fetching departments and HODs error');
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}