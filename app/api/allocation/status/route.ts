import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const semesterId = url.searchParams.get('semesterId'); // e.g. /api/allocation/status?semesterId=123
    logger.info({ url: req.url, method: req.method, semesterId }, 'Fetching allocation status');

    try {
        const response = await fetch(getBackendApiUrl(`/api/v1/allocation/status/${semesterId}`), {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            }
        });

        if (response.ok) {
            const data = await response.json();
            logger.info({ message: 'Fetching allocation status successful', semesterId });
            return NextResponse.json(data, { status: 201 });
        } else {
            const errorData = await response.json();
            logger.error({ message: 'Fetching allocation status failed', semesterId, error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        logger.error({ message: 'Fetching allocation status error', semesterId, error });
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}