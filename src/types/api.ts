import { Action } from "./action_trace";

export type AliveResponse = string;
export type GetAbiSnapshotResponse = string;

export interface GetActionsResponse {
    query_time: number;
    lib: number;
    actions: Action[];
}

export interface GetKeyAccountsResponse {
    account_names: string[];
}

export interface GetTransactedAccountsResponse {
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

export interface GetTransactionResponse {
    trx_id: string;
    lib: number;
    actions: Action[];
}

export interface GetTransfersResponse {
    trx_id: string;
    lib: number;
    actions: Action[];
}

export interface GetTransfersResponse {
    action_count: number;
    total_amount: number;
    actions: Action[];
}

export interface GetCreatorResponse {
    account: string;
    creator: string;
    timestamp: string;
    trx_id: string;
    indirect_creator: string;
}

export interface GetTokensResponse {
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
