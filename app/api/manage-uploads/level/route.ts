import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

export async function POST(req: NextRequest) {
    const reqBody = await req.json();
    logger.info({url: req.url, method: req.method, message: 'Creating level', level: reqBody });

    try {
        const response = await fetch(getBackendApiUrl('/api/v1/levels/create'), {
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
            logger.info({ message: 'Creating level successful', level: data });
            return NextResponse.json(data, { status: 201 });
        } else {
            const errorData = await response.json();
            logger.error({ message: 'Creating level failed', level: reqBody, error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        logger.error({ message: 'Creating level error', error });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    logger.info({url: req.url, method: req.method, message: 'Fetching levels' });
    try {
        const response = await fetch(getBackendApiUrl('/api/v1/levels/list'), {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            },
        });

        if (response.ok) {
            const data = await response.json();
            logger.info({ message: 'Fetching levels successful' });
            return NextResponse.json(data, { status: 200 });
        } else {
            const errorData = await response.json();
            logger.error({ message: 'Fetching levels failed', error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        logger.error({ message: 'Fetching levels error', error });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}