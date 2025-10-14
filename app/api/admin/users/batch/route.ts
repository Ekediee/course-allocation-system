import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

export async function POST(req: NextRequest) {
  logger.info({ url: req.url, method: req.method }, 'Batch user upload attempt');
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const departmentId = formData.get('department_id');

    if (departmentId === null) {
      logger.error({ message: 'Batch user upload failed', error: 'department_id is required' });
      return NextResponse.json({ error: 'department_id is required' }, { status: 400 });
    }
    const department_id: number = Number(departmentId);

    if (!file || !(file instanceof File)) {
      logger.error({ message: 'Batch user upload failed', error: 'No file uploaded' });
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');
    const lines = text.split('\n').filter(Boolean);
    const records: any[] = [];
    
    
    // Assuming CSV format: name,gender,email,role,phone
    // Skip header and process each line
    for (const line of lines.slice(1)) {
      const [name, gender, email, role, phone] = line.split(',').map(s => s.trim());
      if (name && gender && email && role && phone) {
        
        records.push({
          name,
          gender,
          email,
          role,
          phone,
          department_id,
        });
      }
    }

    if (records.length === 0) {
        logger.error({ message: 'Batch user upload failed', error: 'CSV file is empty or contains no valid data.' });
        return NextResponse.json({ error: 'CSV file is empty or contains no valid data.' }, { status: 400 });
    }

    const flaskRes = await fetch(getBackendApiUrl('/api/v1/admin/users/batch'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || ''
      },
      body: JSON.stringify({ users: records }),
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

      logger.error({ message: 'Batch user upload failed', error: errorData });
      return NextResponse.json({ error: errorData.errors || errorData.msg || 'Something went wrong' }, { status: flaskRes.status });
    }

    logger.info({ message: 'Batch user upload successful', count: records.length });
    return NextResponse.json({
      message: 'CSV uploaded and sent to backend successfully',
      count: records.length,
      response: flaskData,
    });
  } catch (err) {
    logger.error({ err }, 'Login error');
    return NextResponse.json({ error: err || 'Error processing upload' }, { status: 500 });
  }
}