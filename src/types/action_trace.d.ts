export interface Action {
    act: Act;
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

export interface Act {
    account: string;
    name: string;
    authorization: Authorization[];
    data: any;
}

export interface Authorization {
    actor: string;
    permission: string;
}
