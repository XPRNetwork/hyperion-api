export interface Action<T> {
    act: Act<T>;
    account_ram_deltas?: AccountRAMDelta[];
    "@timestamp": Date;
    block_num: number;
    producer: string;
    trx_id: string;
    parent: number;
    global_sequence: number;
    notified: string[];
}

export interface AccountRAMDelta {
    account: string;
    delta: string;
}

export interface Act<T> {
    account: string;
    name: string;
    authorization: Authorization[];
    data: T;
}

export interface Authorization {
    actor: string;
    permission: string;
}
