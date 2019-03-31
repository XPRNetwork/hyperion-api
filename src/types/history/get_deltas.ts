export interface GetDeltas<T> {
    query_time: number;
    total: Total;
    deltas: Array<Delta<T>>;
}

interface Delta<T> {
    code: string;
    scope: string;
    table: string;
    primary_key: number | string;
    payer: string;
    data: T;
    block_num: number;
    [other: string]: any;
}

interface Total {
    value: number;
    relation: string;
}
