
export type PaginatedResponse<T> = {
  items: T[];
  cursor: string | null;
}
