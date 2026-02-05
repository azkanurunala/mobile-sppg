'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Search, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Filter,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Column<T> {
  header: string;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchFields?: (keyof T | string)[];
  searchPlaceholder?: string;
  filters?: {
    label: string;
    field: keyof T | string;
    options: { label: string; value: any }[];
  }[];
  initialPageSize?: number;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  searchFields = [],
  searchPlaceholder = 'Search...',
  filters = [],
  initialPageSize = 10,
  onRowClick,
  isLoading = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' | null }>({
    key: '',
    direction: null,
  });
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // --- Logic: Filtering & Searching ---
  const filteredData = useMemo(() => {
    return data.filter((item: any) => {
      // Search
      const matchesSearch = searchTerm === '' || searchFields.some(field => {
        const value = field.toString().split('.').reduce((obj, key) => obj?.[key], item);
        return String(value || '').toLowerCase().includes(searchTerm.toLowerCase());
      });

      // Filters
      const matchesFilters = Object.entries(activeFilters).every(([field, value]) => {
        if (!value) return true;
        const itemValue = field.split('.').reduce((obj, key) => obj?.[key], item);
        return String(itemValue) === String(value);
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, searchFields, activeFilters]);

  // --- Logic: Sorting ---
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return filteredData;

    return [...filteredData].sort((a: any, b: any) => {
      const aValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const bValue = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // --- Logic: Pagination ---
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    else if (sortConfig.key === key && sortConfig.direction === 'desc') direction = null;

    setSortConfig({ key, direction });
  };

  const handleFilterChange = (field: string, value: any) => {
    setActiveFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* --- Toolbar: Search & Filters --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {filters.map((filter) => (
            <div key={filter.field.toString()} className="flex items-center gap-2">
              <select
                value={activeFilters[filter.field.toString()] || ''}
                onChange={(e) => handleFilterChange(filter.field.toString(), e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                <option value="">{filter.label}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}

          {(searchTerm || Object.values(activeFilters).some(Boolean)) && (
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{Math.min(sortedData.length, (currentPage - 1) * pageSize + 1)}</span>
          {' to '}
          <span className="font-semibold text-gray-900">{Math.min(sortedData.length, currentPage * pageSize)}</span>
          {' of '}
          <span className="font-semibold text-gray-900">{sortedData.length}</span> entries
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      "px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider",
                      column.sortable && "cursor-pointer hover:bg-gray-100 transition-colors select-none",
                      column.className
                    )}
                    onClick={() => column.sortable && column.accessorKey && handleSort(column.accessorKey as string)}
                  >
                    <div className={cn(
                      "flex items-center gap-2",
                      column.className?.includes('text-right') && "justify-end",
                      column.className?.includes('text-center') && "justify-center"
                    )}>
                      {column.header}
                      {column.sortable && (
                        <span className="text-gray-400">
                          {sortConfig.key === column.accessorKey ? (
                            sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                          ) : (
                            <ArrowUpDown size={14} className="opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="px-6 py-4">
                        <div className="h-4 bg-gray-100 rounded w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <Filter size={48} className="opacity-20" />
                      <p className="text-lg font-medium">No results found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item: any, idx) => (
                  <tr
                    key={item.id || idx}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      "group hover:bg-blue-50/30 transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className={cn("px-6 py-4 whitespace-nowrap text-sm", column.className)}>
                        {column.cell ? column.cell(item) : (
                          column.accessorKey ? (
                            String((column.accessorKey as string).split('.').reduce((obj, key) => obj?.[key], item) ?? '-')
                          ) : '-'
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-200 rounded text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50, 100].map(size => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1 px-2">
              <span className="text-sm text-gray-500">Page</span>
              <span className="text-sm font-bold text-gray-900">{currentPage}</span>
              <span className="text-sm text-gray-500">of {totalPages || 1}</span>
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
