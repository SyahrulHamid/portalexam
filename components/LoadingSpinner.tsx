import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2" aria-live="polite" aria-busy="true">
      <div className="w-12 h-12 border-4 border-slate-500 border-t-blue-400 rounded-full animate-spin"></div>
      <span className="text-slate-400">Memuat data...</span>
    </div>
  );
};

export default LoadingSpinner;