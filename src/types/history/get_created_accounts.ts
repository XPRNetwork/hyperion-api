export interface GetCreatedAccounts {
    query_time: number;
    accounts: Account[];
}

interface Account {
    name: string;
    timestamp: string;
    trx_id: string;
}
