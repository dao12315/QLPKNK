import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button variant="outline" size="sm" disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>
        <ChevronLeft size={16} />
      </Button>
      <span className="text-sm text-neutral-500">
        Trang <strong>{currentPage + 1}</strong> / {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={currentPage >= totalPages - 1} onClick={() => onPageChange(currentPage + 1)}>
        <ChevronRight size={16} />
      </Button>
    </div>
  );
};
