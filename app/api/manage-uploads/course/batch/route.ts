import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  logger.info({url: req.url, method: req.method, message: 'Batch course upload attempt' });
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const bulletinId = formData.get('bulletin_id');
    const programId = formData.get('program_id');
    const specializationId = formData.get('specialization_id');
    const semesterId = formData.get('semester_id');
    const levelId = formData.get('level_id');
    const courseTypeId = formData.get('course_type_id');

    // Validate required fields
    if (bulletinId === null) {
      logger.error({ message: 'Batch course upload failed', error: 'bulletin_id is required' });
      return NextResponse.json({ error: 'bulletin_id is required' }, { status: 400 });
    }
    if (programId === null) {
      logger.error({ message: 'Batch course upload failed', error: 'program_id is required' });
      return NextResponse.json({ error: 'program_id is required' }, { status: 400 });
    }
    if (semesterId === null) {
      logger.error({ message: 'Batch course upload failed', error: 'semester_id is required' });
      return NextResponse.json({ error: 'semester_id is required' }, { status: 400 });
    }
    if (levelId === null) {
      logger.error({ message: 'Batch course upload failed', error: 'level_id is required' });
      return NextResponse.json({ error: 'level_id is required' }, { status: 400 });
    }

    const bulletin_id: number = Number(bulletinId);
    const program_id: number = Number(programId);
    const semester_id: number = Number(semesterId);
    const level_id: number = Number(levelId);
    const course_type_id: number = Number(courseTypeId);
    const specialization_id: number | null = specializationId ? Number(specializationId) : null;

    if (!file || !(file instanceof File)) {
      logger.error({ message: 'Batch course upload failed', error: 'No file uploaded' });
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    
    // Parse Excel workbook
    const workbook = XLSX.read(buffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    const records = jsonData.map((row: any) => ({
      code: row.code || row["Code"] || null, // support header variations
      title: row.title || row["Title"] || null,
      unit: row.unit || row["Unit"] || null,
      bulletin_id,
      program_id,
      specialization_id,
      semester_id,
      level_id,
      course_type_id
    })).filter((r) => r.code || r.title || r.unit); // filter out empty rows

    if (records.length === 0) {
        logger.error({ message: 'Batch course upload failed', error: 'CSV file is empty or contains no valid data.' });
        return NextResponse.json({ error: 'CSV file is empty or contains no valid data.' }, { status: 400 });
    }

    const flaskRes = await fetch(getBackendApiUrl('/api/v1/courses/batch'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || ''
      },
      body: JSON.stringify({ courses: records }),
    });

    const flaskData = await flaskRes.json();
    
    let errorData = null;
    if (!flaskRes.ok) {
      // Check if token expired
      const authError = handleAuthError(flaskRes, errorData);
      if (authError) return authError; // auto-clears cookies

      logger.error({ message: 'Batch course upload failed', status: flaskRes.status, body: flaskData });
      return NextResponse.json({message: flaskData.message, error: flaskData.errors || 'Something went wrong' }, { status: flaskRes.status });
    }

    logger.info({ message: 'Batch course upload successful', count: records.length });
    return NextResponse.json({
      message: 'CSV uploaded and sent to backend successfully',
      count: records.length,
      response: flaskData,
    });
  } catch (err) {
    logger.error({ err }, 'Batch course upload error');
    return NextResponse.json({ error: err || 'Error processing upload' }, { status: 500 });
  }
}