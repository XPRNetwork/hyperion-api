import { Action } from "../action_trace";

export interface GetActions<T> {
  query_time: number;
  lib: number;
  total: Total;
  actions: Action<T>[];
}

interface Total {
  value: number;
  relation: string;
}
