import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const bulletinId = formData.get('bulletin_id');
    const programId = formData.get('program_id');
    const specializationId = formData.get('specialization_id');
    const semesterId = formData.get('semester_id');
    const levelId = formData.get('level_id');

    // Validate required fields
    if (bulletinId === null) {
      return NextResponse.json({ error: 'bulletin_id is required' }, { status: 400 });
    }
    if (programId === null) {
      return NextResponse.json({ error: 'program_id is required' }, { status: 400 });
    }
    if (semesterId === null) {
      return NextResponse.json({ error: 'semester_id is required' }, { status: 400 });
    }
    if (levelId === null) {
      return NextResponse.json({ error: 'level_id is required' }, { status: 400 });
    }

    const bulletin_id: number = Number(bulletinId);
    const program_id: number = Number(programId);
    const semester_id: number = Number(semesterId);
    const level_id: number = Number(levelId);
    const specialization_id: number | null = specializationId ? Number(specializationId) : null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');

    const lines = text.split('\n').filter(Boolean);
    const records: any[] = [];

    // Assuming CSV format: CourseCode,CourseTitle,CourseUnit
    // Skip header and process each line
    for (const line of lines.slice(1)) {
      const [code, title, unit] = line.split(',').map(s => s.trim());
      if (code && title && unit) {
        records.push({
          code,
          title,
          unit: parseInt(unit),
          bulletin_id,
          program_id,
          specialization_id,
          semester_id,
          level_id,
        });
      }
    }

    if (records.length === 0) {
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
    
    if (!flaskRes.ok) {
      return NextResponse.json({ error: flaskData.errors || flaskData.msg || 'Something went wrong' }, { status: flaskRes.status });
    }

    return NextResponse.json({
      message: 'CSV uploaded and sent to backend successfully',
      count: records.length,
      response: flaskData,
    });
  } catch (error) {
    return NextResponse.json({ error: error || 'Error processing upload' }, { status: 500 });
  }
}