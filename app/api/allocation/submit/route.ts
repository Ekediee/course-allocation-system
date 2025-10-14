import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export async function POST(req: NextRequest) {
    const reqBody = await req.json();
    logger.info({  url: req.url, method: req.method, message: 'Submitting allocation', allocation: reqBody });

    try {
        const response = await fetch(getBackendApiUrl('/api/v1/allocation/submit'), {
            cache: 'no-store',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            },
            body: JSON.stringify(reqBody),
        });

        if (response.ok) {
            const data = await response.json();
            logger.info({ message: 'Submitting allocation successful', allocation: data });
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

            logger.error({ message: 'Submitting allocation failed', allocation: reqBody, error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (err) {
        logger.error({ err }, 'Submitting allocation error');
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

