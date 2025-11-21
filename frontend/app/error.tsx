'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black px-4">
      <h1 className="text-4xl font-black tracking-tighter mb-4">Something went wrong!</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-8 py-4 border border-black text-black text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
