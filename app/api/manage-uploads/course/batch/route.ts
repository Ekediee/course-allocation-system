import { NextResponse } from 'next/server';

// POST handler for batch creating courses from a CSV file
export const POST = async (req: Request) => {
  const formData = await req.formData();

  try {
    // Forward the FormData to the core backend service
    const res = await fetch('http://127.0.0.1:5000/api/v1/courses/batch', {
        method: 'POST',
        body: formData,
        // Note: When sending FormData, the 'Content-Type' header is set automatically
        // by fetch() to 'multipart/form-data' with the correct boundary.
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || 'Failed to batch create courses' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
