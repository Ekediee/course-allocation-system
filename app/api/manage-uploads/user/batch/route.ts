import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const departmentId = formData.get('department_id');

    if (departmentId === null) {
      return NextResponse.json({ error: 'department_id is required' }, { status: 400 });
    }
    const department_id: number = Number(departmentId);

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const text = Buffer.from(buffer).toString('utf8');
    const lines = text.split('\n').filter(Boolean);
    const records: any[] = [];
    
    
    // Assuming CSV format: name,gender,email,role,rank,phone,qualification,area_of_specialization,other_responsibilities,department_id
    // Skip header and process each line
    for (const line of lines.slice(1)) {
      const [name, gender, email, role, rank, phone, qualification, specialization, other_responsibilities] = line.split(',').map(s => s.trim());
      if (name && gender && email && role && rank && phone && qualification && specialization) {
        
        records.push({
          name,
          gender,
          email,
          role,
          rank,
          phone,
          qualification,
          specialization,
          other_responsibilities,
          department_id,
        });
      }
    }

    if (records.length === 0) {
        return NextResponse.json({ error: 'CSV file is empty or contains no valid data.' }, { status: 400 });
    }

    const flaskRes = await fetch(getBackendApiUrl('/api/v1/users/batch'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || ''
      },
      body: JSON.stringify({ users: records }),
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