export interface GetTransactedAccounts {
    query_time: number;
    account: string;
    total_in: number;
    inputs: Input[];
}

interface Input {
    account: string;
    sum: number;
    transfers: number;
    average: number;
}
