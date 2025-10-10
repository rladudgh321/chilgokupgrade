'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Header from './layout/app/Header';
import Footer from './layout/app/Footer';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold mb-4">500 - Server Error</h1>
            <p className="text-lg mb-8">Something went wrong on our end.</p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try again
            </button>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
