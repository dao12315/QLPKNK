import React from 'react';
import { cn } from '@/src/shared/utils/cn';
import { PageSpinner } from './Spinner';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyText?: string;
  keyExtractor: (row: T) => string;
}

export function Table<T>({ columns, data, isLoading, emptyText = 'Không có dữ liệu', keyExtractor }: TableProps<T>) {
  if (isLoading) return <PageSpinner />;

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-100">
      <table className="w-full border-collapse text-left">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map(col => (
              <th key={col.key} className={cn('px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-400', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center text-sm text-neutral-400">{emptyText}</td>
            </tr>
          ) : (
            data.map(row => (
              <tr key={keyExtractor(row)} className="hover:bg-neutral-50/60 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className={cn('px-5 py-4 text-sm text-neutral-700', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
