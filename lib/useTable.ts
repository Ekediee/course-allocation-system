import { useMemo } from 'react';

const getNested = (obj: any, path: string) => {
  if (!obj || !path) return undefined;
  // support paths like "a.b.c" or "arr.0.name"
  return path.split('.').reduce((acc: any, key: string) => {
    if (acc === undefined || acc === null) return undefined;
    // numeric index for arrays
    const index = Number(key);
    if (!Number.isNaN(index) && Array.isArray(acc)) {
      return acc[index];
    }
    return acc[key];
  }, obj);
};

export type UseTableOptions<T> = {
  data?: T[];
  searchTerm?: string;
  searchKeys?: string[]; // supports nested paths like "school.name"
  sortColumn?: string; // supports nested path
  sortDirection?: 'asc' | 'desc';
  currentPage?: number;
  itemsPerPage?: number;
};

export function useTable<T extends Record<string, any>>(opts: UseTableOptions<T>) {
  const {
    data = [],
    searchTerm = '',
    searchKeys = [],
    sortColumn = '',
    sortDirection = 'asc',
    currentPage = 1,
    itemsPerPage = 10,
  } = opts;

  const normalized = useMemo(() => {
    const q = String(searchTerm || '').trim().toLowerCase();

    const filtered = q
      ? data.filter((item) =>
          searchKeys.some((key) => {
            const v = getNested(item, key);
            return String(v ?? '').toLowerCase().includes(q);
          })
        )
      : data.slice();

    const sorted = sortColumn
      ? filtered.slice().sort((a, b) => {
          const aValue = getNested(a, sortColumn);
          const bValue = getNested(b, sortColumn);

          if (aValue == null && bValue == null) return 0;
          if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
          if (bValue == null) return sortDirection === 'asc' ? 1 : -1;

          const aNum = Number(aValue);
          const bNum = Number(bValue);
          if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
            return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
          }

          return sortDirection === 'asc'
            ? String(aValue).toLowerCase().localeCompare(String(bValue).toLowerCase())
            : String(bValue).toLowerCase().localeCompare(String(aValue).toLowerCase());
        })
      : filtered;

    const totalItems = sorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, itemsPerPage)));
    const start = (Math.max(1, currentPage) - 1) * itemsPerPage;
    const paginated = sorted.slice(start, start + itemsPerPage);

    return { filtered, sorted, paginated, totalPages, totalItems };
  }, [
    data,
    searchTerm,
    searchKeys.join(','),
    sortColumn,
    sortDirection,
    currentPage,
    itemsPerPage,
  ]);

  return normalized;
}