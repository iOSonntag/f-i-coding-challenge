
export type PagedResponse<T> = {
  items: T[];
  cursor: string | null;
}
