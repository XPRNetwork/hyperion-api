import { V2_ALIVE, V2_GET_ABI_SNAPSHOT, V2_GET_ACTIONS, V2_GET_CREATOR, V2_GET_KEY_ACCOUNTS, V2_GET_TOKENS, V2_GET_TRANSACTED_ACCOUNTS, V2_GET_TRANSACTION, V2_GET_TRANSFERS } from "./endpoints";
import { RpcError, RpcStatusError } from "./rpcerror";
import { AliveResponse, GetAbiSnapshotResponse, GetActionsResponse, GetCreatorResponse, GetKeyAccountsResponse, GetTokensResponse, GetTransactedAccountsResponse, GetTransactionResponse, GetTransfersResponse } from "./types/api";

function queryParams(params: {[key: string]: any}) {
    const entries = [];
    for (const key of Object.keys(params)) {
        const value = params[key];
        if (value !== undefined) { entries.push(encodeURIComponent(key) + "=" + encodeURIComponent(value)); }
    }
    return entries.join("&");
}

export type Fetch = (url: string | Request, init?: RequestInit) => Promise<Response>;
declare const global: any;

/** Make RPC calls */
export class JsonRpc {
    public endpoint: string;
    public fetchBuiltin: Fetch;

    /**
     * @param args
     *    * `fetch`:
     *    * browsers: leave `null` or `undefined`
     *    * node: provide an implementation
     */
    constructor(endpoint: string, args: { fetch?: Fetch } = {}) {
        this.endpoint = endpoint;
        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (global as any).fetch;
        }
    }

    /** POST `body` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async post<T>(path: string, body: any): Promise<T> {
        let response;
        let json;
        try {
            const f = this.fetchBuiltin;
            response = await f(this.endpoint + path, {
                body: JSON.stringify(body),
                method: "POST",
            });
            json = await response.json();
            if (json.processed && json.processed.except) {
                throw new RpcError(json);
            }
        } catch (e) {
            e.isFetchError = true;
            throw e;
        }
        if (!response.ok) {
            throw new RpcError(json);
        }
        return json;
    }

    /** GET `params` to `endpoint + path`. Throws detailed error information in `RpcError` when available. */
    public async get<T>(path: string, params: any): Promise<T> {
        let response;
        let json;
        const url = this.endpoint + path + "?" + queryParams(params);
        try {
            const f = this.fetchBuiltin;
            response = await f(url, {
                method: "GET",
            });

            if (response.status !== 200) {
                throw new RpcStatusError(response);
            }

            json = await response.json();
            if (json.processed && json.processed.except) {
                throw new RpcError(json);
            }
        } catch (e) {
            e.isFetchError = true;
            throw e;
        }
        if (!response.ok) {
            throw new RpcError(json);
        }
        return json;
    }

    /**
     * GET /v2/history/alive
     *
     * simple server healthcheck
     */
    public async alive() {
        return this.get<AliveResponse>(V2_ALIVE, {});
    }

    /**
     * GET /v2/history/get_abi_snapshot
     *
     * fetch contract abi at specific block
     *
     * @param {string} contract contract account
     * @param {string} number target block
     */
    public async get_abi_snapshot(contract: string, block: number) {
        const params = {
            contract,
            block,
        };
        return await this.get<GetAbiSnapshotResponse>(V2_GET_ABI_SNAPSHOT, params);
    }

    /**
     * GET /v2/history/get_actions
     *
     * get actions based on notified account
     *
     * @param {string} account notified account
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.filter] code::name filter
     * @param {number} [options.skip] skip [n] actions (pagination)
     * @param {number} [options.limit] limit of [n] actions per page
     * @param {string} [options.sort] sort direction
     * @param {string} [options.after] filter after specified date (ISO8601)
     * @param {string} [options.before] filter before specified date (ISO8601)
     * @param {string} [options.transfer_to] transfer filter to
     * @param {string} [options.transfer_from]  transfer filter from
     * @param {string} [options.transfer_symbol]  transfer filter symbol
     * @param {string} [options.act_name]  act name
     * @param {string} [options.act_account]  act account
     */
    public async get_actions(account: string, options: {
        filter?: string,
        skip?: number,
        limit?: number,
        sort?: string,
        after?: string,
        before?: string,
        transfer_to?: string,
        transfer_from?: string,
        transfer_symbol?: string,
        act_name?: string,
        act_account?: string
    } = {}) {
        const params = {
            account,
            filter: options.filter,
            skip: options.skip,
            limit: options.limit,
            sort: options.sort,
            after: options.after,
            before: options.before,
            ['transfer.to']: options.transfer_to,
            ['transfer.from']: options.transfer_from,
            ['transfer.symbol']: options.transfer_symbol,
            ['act.name']: options.act_name,
            ['act.account']: options.act_account
        };
        return await this.get<GetActionsResponse>(V2_GET_ACTIONS, params);
    }

    /**
     * GET/v2/history/get_key_accounts
     *
     * get account by public key
     *
     * @param {string} public_key Contract account targeted by the action.
     */
    public async get_key_accounts(public_key: string) {
        const params = {
            public_key,
        };
        return await this.get<GetKeyAccountsResponse>(V2_GET_KEY_ACCOUNTS, params);
    }

    /**
     * GET /v2/history/get_transacted_accounts
     *
     * get all account that interacted with the source account provided
     *
     * @param {string} account source account
     * @param {string} direction search direction (in, out or both)
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.symbol] token symbol
     * @param {string} [options.contract] token contract
     * @param {number} [options.min] minimum value
     * @param {number} [options.max] maximum value
     * @param {number} [options.limit] query limit
     */
    public async get_transacted_accounts(account: string, direction: string, options: {
        symbol?: string,
        contract?: string,
        min?: number,
        max?: number,
        limit?: number,
    } = {}) {
        const params = {
            account,
            direction,
            symbol: options.symbol,
            contract: options.contract,
            min: options.min,
            max: options.max,
            limit: options.limit,
        };
        return await this.get<GetTransactedAccountsResponse>(V2_GET_TRANSACTED_ACCOUNTS, params);
    }

    /**
     * GET /v2/history/get_transaction
     *
     * get all actions belonging to the same transaction
     *
     * @param {string} id transaction id
     */
    public async get_transaction(id: string) {
        const params = {
            id,
        };
        return await this.get<GetTransactionResponse>(V2_GET_TRANSACTION, params);
    }

    /**
     * GET /v2/history/get_transfers
     *
     * get token transfers utilizing the eosio.token standard
     *
     * @param {object} [options={}] Optional parameters
     * @param {string} [options.from] source account
     * @param {string} [options.to] destination account
     * @param {string} [options.symbol] token symbol
     * @param {string} [options.contract] token contract
     * @param {string} [options.after] filter after specified date (ISO8601)
     * @param {string} [options.before] filter before specified date (ISO8601)
     */
    public async get_transfers(options: {
        from?: string
        to?: string
        symbol?: string
        contract?: string
        after?: string,
        before?: string,
    } = {}) {
        const params = {
            from: options.from,
            to: options.to,
            symbol: options.symbol,
            contract: options.contract,
            after: options.after,
            before: options.before,
        };
        return await this.get<GetTransfersResponse>(V2_GET_TRANSFERS, params);
    }

    /**
     * GET /v2/history/get_creator
     *
     * get account creator
     *
     * @param {string} account created account
     */
    public async get_creator(account: string) {
        const params = {
            account,
        };
        return await this.get<GetCreatorResponse>(V2_GET_CREATOR, params);
    }

    /**
     * GET /v2/history/get_tokens
     *
     * get tokens from account
     *
     * @param {string} account created account
     */
    public async get_tokens(account: string) {
        const params = {
            account,
        };
        return await this.get<GetTokensResponse>(V2_GET_TOKENS, params);
    }
}
