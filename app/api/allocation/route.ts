import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const res = await fetch('https://mocki.io/v1/3e18188b-b1e1-403e-8e63-b2a5132cab79', {
      cache: 'no-store', // prevent caching for fresh data
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
