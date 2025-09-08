import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const schoolid = formData.get('school_id');

    // If you want to throw an error if missing:
    if (schoolid === null) {
    return NextResponse.json({ error: 'school_id is required' }, { status: 400 });
    }
    const school_id: number = Number(schoolid);

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file content as text
    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    // Parse CSV (assumes columns: name,acronym)
    const lines = text.split('\n').filter(Boolean);
    const records: { name: string; school_id: number; acronym: string }[] = [];

    for (const line of lines.slice(1)) { // skip header
      const [name, acronym] = line.split(',').map(s => s.trim());
      if (name && acronym) records.push({ name, school_id, acronym });
    }

    // Send parsed data to Flask backend
    const flaskRes = await fetch(getBackendApiUrl('/api/v1/departments/batch'), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '' 
      },
      body: JSON.stringify({ departments: records }),
    });

    const flaskData = await flaskRes.json();

    if (!flaskRes.ok) {
      return NextResponse.json({ error: flaskData.error || 'Something went wrong' }, { status: flaskRes.status });
    }

    return NextResponse.json({
      message: 'CSV uploaded and sent to backend successfully',
      count: records.length,
      response: flaskData,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}