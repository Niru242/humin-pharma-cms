/**
 * Standard pagination request params (Section 9).
 * List endpoints support: search, filters, page, pageSize, sort.
 */
export interface PaginationParams {
  page?: number;      // 1-based, default 1
  pageSize?: number;  // default 20, max 100
  sort?: string;      // field name
  sortOrder?: 'asc' | 'desc';
  search?: string;    // full-text search term
}

/**
 * Standard paginated response shape (Section 9).
 * Every list endpoint returns items[] + pageInfo.
 */
export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
