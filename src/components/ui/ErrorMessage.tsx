'use client';

import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  retry?: () => void;
}

export default function ErrorMessage({
  message = 'Something went wrong. Please try again later.',
  retry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-200 mb-2">Error</h3>
            <p className="text-sm text-red-800 dark:text-red-300">{message}</p>
            {retry && (
              <button
                onClick={retry}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
