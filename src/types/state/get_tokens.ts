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
