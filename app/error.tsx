'use client';

import { useEffect } from 'react';
import { logClientError } from '@/lib/client/logClientError';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log error to server
    logClientError(error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-red-600">Something went wrong!</h1>
        <p className="mt-2 text-gray-700">{error.message}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => reset()}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
