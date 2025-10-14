import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export async function POST(req: NextRequest) {
  logger.info({url: req.url, method: req.method, message: 'Batch program upload attempt' });
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const deptid = formData.get('department_id');

    // If you want to throw an error if missing:
    if (deptid === null) {
      logger.error({ message: 'Batch program upload failed', error: 'department_id is required' });
      return NextResponse.json({ error: 'department_id is required' }, { status: 400 });
    }
    const department_id: number = Number(deptid);

    if (!file || !(file instanceof File)) {
      logger.error({ message: 'Batch program upload failed', error: 'No file uploaded' });
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file content as text
    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    // Parse CSV (assumes columns: name,acronym)
    const lines = text.split('\n').filter(Boolean);
    const records: { name: string; department_id: number; acronym: string }[] = [];

    for (const line of lines.slice(1)) { // skip header
      const [name, acronym] = line.split(',').map(s => s.trim());
      if (name && acronym) records.push({ name, department_id, acronym });
    }

    // Send parsed data to Flask backend
    const flaskRes = await fetch(getBackendApiUrl('/api/v1/programs/batch'), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '' 
      },
      body: JSON.stringify({ programs: records }),
    });

    const flaskData = await flaskRes.json();

    let errorData = null;
    if (!flaskRes.ok) {
      try {
        errorData = await flaskRes.json();
      } catch {
        errorData = {};
      }

      // Check if token expired
      const authError = handleAuthError(flaskRes, errorData);
      if (authError) return authError; // auto-clears cookies

      logger.error({ message: 'Batch program upload failed', error: errorData });
      return NextResponse.json({ error: errorData.error || 'Something went wrong' }, { status: flaskRes.status });
    }

    logger.info({ message: 'Batch program upload successful', count: records.length });
    return NextResponse.json({
      message: 'CSV uploaded and sent to backend successfully',
      count: records.length,
      response: flaskData,
    });
  } catch (err) {
    logger.error({ err }, 'Batch program upload error');
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}