export interface ServiceData {
    head_block_num: number;
    head_block_time: Date;
    time_offset: number;
    last_irreversible_block: number;
    chain_id: string;
    active_shards: string;
    head_offset?: number;
    first_indexed_block?: number;
    last_indexed_block?: number;
    total_indexed_blocks?: number;
    missing_blocks?: number;
    missing_pct: string;
}

export interface Health {
    service: string;
    status: string;
    time: any;
    service_data: ServiceData;
}

export interface Streaming {
    enable: boolean;
    traces: boolean;
    deltas: boolean;
}

export interface Tables {
    proposals: boolean;
    accounts: boolean;
    voters: boolean;
}

export interface Features {
    streaming: Streaming;
    tables: Tables;
    index_deltas: boolean;
    index_transfer_memo: boolean;
    index_all_deltas: boolean;
    failed_trx: boolean;
    deferred_trx: boolean;
    resource_limits: boolean;
    resource_usage: boolean;
}

export interface HealthV2 {
    version: string;
    version_hash: string;
    host: string;
    health: Health[];
    features: Features;
    query_time_ms: number;
}