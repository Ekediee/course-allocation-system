import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const deptid = formData.get('department_id');
    const progid = formData.get('program_id');

    if (deptid === null) {
      return NextResponse.json({ error: 'department_id is required' }, { status: 400 });
    }
    if (progid === null) {
      return NextResponse.json({ error: 'program_id is required' }, { status: 400 });
    }
    const department_id: number = Number(deptid);
    const program_id: number = Number(progid);

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    // Corrected CSV Parsing for a single 'specialization_name' column
    const lines = text.split('\n').filter(Boolean);
    const records: { name: string; department_id: number; program_id: number }[] = [];

    // Skip header and process each line
    for (const line of lines.slice(1)) {
      const specialization_name = line.trim();
      if (specialization_name) {
        records.push({ name: specialization_name, department_id, program_id });
      }
    }

    if (records.length === 0) {
        return NextResponse.json({ error: 'CSV file is empty or contains no valid data.' }, { status: 400 });
    }

    // Send parsed data to Flask backend
    const flaskRes = await fetch('http://127.0.0.1:5000/api/v1/specializations/batch-upload', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '' 
      },
      body: JSON.stringify({ specializations: records }),
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