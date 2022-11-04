export interface GetTableState<T> {
  query_time: number;
  code: string;
  table: string;
  next_key: string;
  results: Array<State<T>>;
}

interface State<T> {
  scope: string;
  primary_key: string;
  payer: string;
  timestamp: string;
  block_num: number;
  block_id: string;
  present: number;
  data: T;
}
