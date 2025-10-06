// app/api/log/client-error/route.ts
// export const runtime = 'nodejs'; // enable Node runtime

import logger from '@/lib/server-only/logger';

export async function POST(req: Request) {
  try {
    const { message, stack, url, componentStack, extra } = await req.json();

    // Write to server log file
    logger.error({
      message,
      stack,
      url,
      componentStack,
      extra,
    }, 'Client-side error reported');

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Failed to log client error', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
