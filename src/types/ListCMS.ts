export interface ListProps<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
