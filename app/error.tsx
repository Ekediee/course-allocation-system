'use client';

import { useEffect } from 'react';
import logger from '@/lib/logger';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logger.error({ message: 'Unhandled client-side error', error });
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
