import { Action } from "./action_trace";
export { GetAbiSnapshot } from "./get_abi_snapshot";

export interface Alive {
    status: string;
}

export interface GetActions {
    query_time: number;
    lib: number;
    actions: Action[];
}

export interface GetKeyAccounts {
    account_names: string[];
}

export interface GetAccountCreator {
  account: string;
  creator: string;
  timestamp: string;
  trx_id: string;
}

export interface GetTokens {
  query_time: number;
  account: string;
  tokens: Token[];
}

export interface Token {
  symbol: string;
  precision: number;
  amount: number;
  contract: string;
}

export interface GetTransactedAccounts {
    query_time: number;
    account: string;
    total_in: number;
    inputs: Input[];
}

export interface Input {
    account: string;
    sum: number;
    transfers: number;
    average: number;
}

export interface GetTransaction {
    trx_id: string;
    lib: number;
    actions: Action[];
}

export interface GetTransfers {
    trx_id: string;
    lib: number;
    actions: Action[];
}

export interface GetTransfers {
    action_count: number;
    total_amount: number;
    actions: Action[];
}
