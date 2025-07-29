import { NextRequest, NextResponse } from 'next/server';

// GET semester data
export const GET = async (req: NextRequest) => {
  try {

    const res = await fetch('http://127.0.0.1:5000/api/v1/semesters/list', {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch semesters' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// POST Session data
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    console.log("Received semester data:", reqBody);

    const res = await fetch('http://127.0.0.1:5000/api/v1/semesters/create', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to create semester' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};