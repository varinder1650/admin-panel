import { useState, useCallback } from 'react';

interface PaginationState {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  onPageChange?: (page: number) => void;
}

export const usePagination = (options: UsePaginationOptions = {}) => {
  const { initialPage = 1, initialPageSize = 10, onPageChange } = options;
  
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: initialPage,
    total_pages: 1,
    total_items: 0,
    has_next: false,
    has_prev: false,
  });

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.total_pages) {
      setPagination(prev => ({ ...prev, current_page: page }));
      onPageChange?.(page);
    }
  }, [pagination.total_pages, onPageChange]);

  const nextPage = useCallback(() => {
    if (pagination.has_next) {
      goToPage(pagination.current_page + 1);
    }
  }, [pagination.has_next, pagination.current_page, goToPage]);

  const prevPage = useCallback(() => {
    if (pagination.has_prev) {
      goToPage(pagination.current_page - 1);
    }
  }, [pagination.has_prev, pagination.current_page, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(pagination.total_pages);
  }, [pagination.total_pages, goToPage]);

  const setPageSize = useCallback((newSize: number) => {
    setPageSizeState(newSize);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  }, []);

  return {
    pagination,
    pageSize,
    setPagination,
    setPageSize,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  };
};