export async function logClientError(error: Error, extra?: Record<string, any>) {
  try {
    await fetch('/api/log/client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: error.message,
        stack: error.stack,
        url: typeof window !== 'undefined' ? window.location.href : null,
        extra,
      }),
    });
  } catch (err) {
    // Fallback to console if network fails
    console.error('Failed to report client error:', err);
  }
}
