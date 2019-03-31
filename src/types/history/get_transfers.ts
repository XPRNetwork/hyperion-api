import { Action } from "../action_trace";

export interface GetTransfers<T = TransferData> {
  action_count: number;
  total_amount: number;
  actions: Array<Action<T>>;
}

export interface TransferData {
  from: string;
  to: string;
  amount: number;
  symbol: string;
  memo: string;
}
