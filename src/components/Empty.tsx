import React from 'react';

interface EmptyProps {
  message: string;
  description?: string;
  action?: React.ReactNode;
}

const Empty = ({ message, description, action }: EmptyProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{message}</h3>
        {description && (
          <p className="text-gray-600 mb-4">{description}</p>
        )}
        {action}
      </div>
    </div>
  );
};

export default Empty;