import React from 'react';
import { cn } from '@/src/shared/utils/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-neutral-200 border-t-blue-600', sizes[size], className)} />
  );
};

export const PageSpinner: React.FC = () => (
  <div className="flex h-64 items-center justify-center">
    <Spinner size="lg" />
  </div>
);
