import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const url = req.nextUrl;
    const semesterId = url.searchParams.get('semesterId'); // e.g. /api/allocation/status?semesterId=123

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
            return NextResponse.json(data, { status: 201 });
        } else {
            const errorData = await response.json();
            return NextResponse.json(errorData, { status: response.status });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}