import { NextResponse } from 'next/server';

export const GET = async (req: any) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const token = searchParams.get('token')
  try {
    const res = await fetch('http://127.0.0.1:5000/api/v1/allocation/list', {
      cache: 'no-store', // prevent caching for fresh data
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    // console.log("fetched allocation: ", data)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export const POST = async (req: any) => {
  const url = new URL(req.url);
  const searchParams = new URLSearchParams(url.searchParams);
  const token = searchParams.get('token')

  const reqBody = await req.json()

  console.log("Allocated courses: ", reqBody)

  try {
    const res = await fetch('http://127.0.0.1:5000/api/v1/allocation/allocate', {
      cache: 'no-store', // prevent caching for fresh data
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody)
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    // console.log("fetched allocation: ", data)
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
  return NextResponse.json(reqBody);
}
