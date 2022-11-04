import { Action } from "../action_trace";

export interface GetTransaction<T> {
  trx_id: string;
  lib: number;
  actions: Action<T>[];
}
