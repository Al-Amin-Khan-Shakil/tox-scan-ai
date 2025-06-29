import React from 'react';
import { Microscope } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({
  size = 'md',
  text = 'Loading...'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary rounded-full opacity-20 animate-ping"></div>
        <div className="relative p-4 bg-gradient-primary rounded-full animate-spin">
          <Microscope className={`${sizeClasses[size]} text-white`} />
        </div>
      </div>
      <p className="text-white/70 text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
});

export default LoadingSpinner;