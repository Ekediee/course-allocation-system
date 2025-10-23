import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';
import * as XLSX from 'xlsx';


export async function POST(req: NextRequest) {
  logger.info({url: req.url, method: req.method, message: 'Batch user upload attempt' });
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

    // Parse Excel workbook
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }); // defval ensures empty cells become empty strings

    const records = jsonData.map((row: any) => ({
      staff_id: row.staff_id || row["Staff ID"] || null, // support header variations
      name: row.name || row["Name"] || null,
      gender: row.gender || row["Gender"] || null,
      email: row.email || row["Email"] || null,
      role: row.role || row["Role"] || null,
      rank: row.rank || row["Rank"] || null,
      phone: row.phone || row["Phone"] || null,
      qualification: row.qualification || row["Qualification"] || null,
      specialization: row.specialization || row["Area of Specialization"] || null,
      other_responsibilities: row.other_responsibilities || row["Other Responsibilities"] || null,
      department_id
    })).filter((r) => r.name || r.staff_id); // skip empty rows


    if (records.length === 0) {
        logger.error({ message: 'Batch user upload failed', error: 'Excel file is empty or contains no valid data.' });
        return NextResponse.json({ error: 'Excel file is empty or contains no valid data.' }, { status: 400 });
    }

    const flaskRes = await fetch(getBackendApiUrl('/api/v1/users/batch'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || ''
      },
      body: JSON.stringify({ users: records }),
    });

    // parse body once
    // let flaskData = {};
    
    const flaskData = await flaskRes.json();
    
    
    // let errorData = null;
    if (!flaskRes.ok) {
      // Check if token expired
      const authError = handleAuthError(flaskRes, flaskData);
      if (authError) return authError; // auto-clears cookies

      logger.error({ message: 'Batch user upload failed', status: flaskRes.status, body: flaskData });
      
      // logger.error({ message: 'Batch user upload failed', error: errorData });
      return NextResponse.json({message: flaskData.message, error: flaskData.errors || 'Something went wrong' }, { status: flaskRes.status });
    }

    logger.info({ message: 'Batch user upload successful', count: records.length });
    return NextResponse.json({
      message: 'CSV uploaded and sent to backend successfully',
      count: records.length,
      response: flaskData,
    });
  } catch (err) {
    logger.error({ err }, 'Batch user upload error');
    return NextResponse.json({ error: err || 'Error processing upload' }, { status: 500 });
  }
}