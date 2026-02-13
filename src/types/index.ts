export * from "./auth";
export * from "./user";
export * from "./medical-record";

// Common types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

export interface SelectOption {
  label: string;
  value: string;
}
