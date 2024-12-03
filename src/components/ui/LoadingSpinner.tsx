// frontend/src/components/ui/LoadingSpinner.tsx
// frontend/src/components/ui/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;

