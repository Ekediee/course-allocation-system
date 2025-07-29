import { NextRequest, NextResponse } from 'next/server';

// POST Session data
export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();

    console.log("POST School data:", reqBody);

    const res = await fetch('http://127.0.0.1:5000/api/v1/schools/create', {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(reqBody),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error }, { status: res.status });
    }

    
    return NextResponse.json(data);
  } catch (error) {
    console.error("POST school error:", error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};

// GET Session data
export const GET = async (req: NextRequest) => {
  try {

    const res = await fetch('http://127.0.0.1:5000/api/v1/schools/list', {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch school' }, { status: res.status });
    }

    const data = await res.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};