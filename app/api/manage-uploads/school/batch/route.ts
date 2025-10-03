import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';

export async function POST(req: NextRequest) {
  logger.info({ message: 'Batch school upload attempt' });
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      logger.error({ message: 'Batch school upload failed', error: 'No file uploaded' });
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file content as text
    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    // Parse CSV (assumes columns: name,acronym)
    const lines = text.split('\n').filter(Boolean);
    const records: { name: string; acronym: string }[] = [];

    for (const line of lines.slice(1)) { // skip header
      const [name, acronym] = line.split(',').map(s => s.trim());
      if (name && acronym) records.push({ name, acronym });
    }

    // Send parsed data to Flask backend
    const flaskRes = await fetch(getBackendApiUrl('/api/v1/schools/batch'), {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '' 
      },
      body: JSON.stringify({ schools: records }),
    });

    const flaskData = await flaskRes.json();

    if (!flaskRes.ok) {
      logger.error({ message: 'Batch school upload failed', error: flaskData });
      return NextResponse.json({ error: flaskData.error || 'Something went wrong' }, { status: flaskRes.status });
    }

    logger.info({ message: 'Batch school upload successful', count: records.length });
    return NextResponse.json({
      message: 'CSV uploaded and sent to backend successfully',
      count: records.length,
      response: flaskData,
    });
  } catch (error) {
    logger.error({ message: 'Batch school upload error', error });
    return NextResponse.json({ error: 'Error processing upload' }, { status: 500 });
  }
}