export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  sort: SortObject;
}

export interface PaginatedResponse<T> {
  content: T[];

  totalElements: number;
  totalPages: number;
  size: number;
  number: number;

  first?: boolean;
  last?: boolean;
  empty?: boolean;
  numberOfElements?: number;

  pageable?: PageableObject;
  sort?: SortObject;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type SortDirection = "asc" | "desc";

export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
}
