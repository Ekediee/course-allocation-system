import { NextResponse } from 'next/server';

// POST handler for creating a new course
export const POST = async (req: Request) => {
  const reqBody = await req.json();

  try {
    const res = await fetch('http://127.0.0.1:5000/api/v1/courses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || 'Failed to create course' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// GET handler for fetching all courses
export const GET = async () => {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/v1/courses', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.error || 'Failed to fetch courses' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
