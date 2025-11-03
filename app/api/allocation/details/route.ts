import { getBackendApiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/server-only/logger';
import { handleAuthError } from '@/lib/server-only/auth-utils';

// GET Allocation Details for a specific course
export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const programCourseId = searchParams.get('program_course_id');
  const semesterId = searchParams.get('semester_id');

  logger.info({
    url: req.url,
    method: req.method,
    message: `Fetching allocation details for course: ${programCourseId}, semester: ${semesterId}`,
  });

  // Validate that the required query parameters are present
  if (!programCourseId || !semesterId) {
    const errorMessage = 'Missing required query parameters: program_course_id and semester_id';
    logger.warn({ message: errorMessage });
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  try {
    // Construct the full URL for the actual backend API, forwarding the parameters
    const backendUrl = getBackendApiUrl(
      `/api/v1/allocation/details?program_course_id=${programCourseId}&semester_id=${semesterId}`
    );

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward the authentication cookie from the client to the backend
        Cookie: req.headers.get('cookie') || '',
      },
    });

    let errorData = null;
    if (!res.ok) {
      try {
        errorData = await res.json();
      } catch {
        // The backend might not have returned JSON
        errorData = { detail: res.statusText };
      }

      // Check for authentication errors (e.g., expired token)
      const authError = handleAuthError(res, errorData);
      if (authError) {
        logger.error({ message: 'Authentication error during allocation details fetch' });
        return authError; // This will auto-clear cookies on the client
      }

      logger.error({ message: 'Fetching allocation details failed', error: errorData });
      return NextResponse.json({ error: 'Failed to fetch allocation details' }, { status: res.status });
    }

    const data = await res.json();
    logger.info({ message: 'Fetching allocation details successful' });
    return NextResponse.json(data);

  } catch (err) {
    logger.error({ err }, 'Server error while fetching allocation details');
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
};