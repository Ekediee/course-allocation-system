import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';

export async function GET(req: NextRequest) {
    logger.info({ url: req.url, method: req.method }, 'Fetching allocation status overview');
    try {
        const response = await fetch(getBackendApiUrl(`/api/v1/allocation/allocation-status-overview`), {
            cache: 'no-store',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.get('cookie') || '',
            }
        });

        if (response.ok) {
            const data = await response.json();
            logger.info({ message: 'Fetching allocation status overview successful' });
            return NextResponse.json(data, { status: 201 });
        } else {
            const errorData = await response.json();
            logger.error({ message: 'Fetching allocation status overview failed', error: errorData });
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (err) {
        logger.error({ err }, 'Fetching allocation status overview error');
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}