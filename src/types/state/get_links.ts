export interface GetLinks {
    query_time_ms: number;
    cached: boolean;
    total: {
      value: number,
      relation: string
    },
    links: Link[]
}

export interface Link {
    block_num: number;
    timestamp: string;
    account: string;
    permission: string;
    code: string;
    action: string;
}