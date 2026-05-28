import React from 'react';
import { cn } from '@/src/shared/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
}

const variants = {
  default: 'bg-neutral-100 text-neutral-600',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
  gray: 'bg-gray-100 text-gray-500',
};

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'default' }) => (
  <span className={cn('inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold', variants[variant], className)}>
    {children}
  </span>
);
