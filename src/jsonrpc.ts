import { V2_ALIVE, V2_GET_ABI_SNAPSHOT, V2_GET_ACTIONS, V2_GET_CREATOR, V2_GET_KEY_ACCOUNTS, V2_GET_TOKENS, V2_GET_TRANSACTED_ACCOUNTS, V2_GET_TRANSACTION, V2_GET_TRANSFERS } from "./endpoints";
import { RpcError, RpcStatusError } from "./rpcerror";
import { Alive, GetAbiSnapshot, GetAccountCreator, GetActions, GetKeyAccounts, GetTransactedAccounts, GetTransaction, GetTransfers } from "./types/api";

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

/**
 * JsonRpc
 *
 * @param {string} endpoint hyperion endpoint
 * @example
 *
 * const endpoint = "https://br.eosrio.io"
 * const rpc = new JsonRpc(endpoint, { fetch })
 */
export class JsonRpc {
    public endpoint: string;
    public fetchBuiltin: Fetch;

    constructor(endpoint: string, args: { fetch?: Fetch } = {}) {
        this.endpoint = endpoint;
        if (args.fetch) {
            this.fetchBuiltin = args.fetch;
        } else {
            this.fetchBuiltin = (global as any).fetch;
        }
    }

    /**
     * post
     *
     * POST `body` to `endpoint + path`.
     * Throws detailed error information in `RpcError` when available.
     *
     * @private
     */
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

    /**
     * get
     *
     * GET `params` to `endpoint + path`.
     * Throws detailed error information in `RpcError` when available.
     *
     * @private
     */
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
     * [GET /v2/state/alive](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_alive)
     *
     * simple server healthcheck
     *
     * @returns {Promise<Alive>} alive
     * @example
     *
     * const response = await rpc.alive();
     * console.log(response);
     * // => {"status": "OK"}
     */
    public alive() {
        return this.get<Alive>(V2_ALIVE, {});
    }

    /**
     * [GET /v2/history/get_abi_snapshot](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_abi_snapshot)
     *
     * fetch contract abi at specific block
     *
     * @param {string} contract contract account
     * @param {number} number target block
     * @returns {Promise<GetAbiSnapshot>} abi snapshot
     * @example
     *
     * const response = await rpc.get_abi_snapshot("eosio", 200);
     * console.log(response.version);
     * // => "eosio::abi/1.0"
     *
     * for (const table of response.tables) {
     *     console.log(table);
     *     // => { name: 'producers', index_type: 'i64', key_names: [ 'owner' ], key_types: [ 'uint64' ], type: 'producer_info' }
     * }
     */
    public get_abi_snapshot(contract: string, block: number) {
        const params = {
            contract,
            block,
        };
        return this.get<GetAbiSnapshot>(V2_GET_ABI_SNAPSHOT, params);
    }

    /**
     * [GET /v2/history/get_actions](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_actions)
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
     * @returns {Promise<GetActions>} get actions
     * @example
     *
     * const response = await rpc.get_actions("eoscafeblock", {
     *     filter: "eosio.token:*",
     *     skip: 100,
     *     limit: 100,
     * });
     *
     * for (const action of response.actions) {
     *     console.log(action);
     *     // => { act: { account: 'eosio.token', name: 'transfer', ... } }
     * }
     */
    public get_actions(account: string, options: {
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
        act_account?: string,
    } = {}) {
        const params = {
            account,
            filter: options.filter,
            skip: options.skip,
            limit: options.limit,
            sort: options.sort,
            after: options.after,
            before: options.before,
            ["transfer.to"]: options.transfer_to,
            ["transfer.from"]: options.transfer_from,
            ["transfer.symbol"]: options.transfer_symbol,
            ["act.name"]: options.act_name,
            ["act.account"]: options.act_account,
        };
        return this.get<GetActions>(V2_GET_ACTIONS, params);
    }

    /**
     * [GET /v2/history/get_creator](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_creator)
     *
     * get account creator
     *
     * @param {string} account created account
     * @returns {Promise<GetAccountCreator>} get creator
     * @example
     *
     * const response = await rpc.get_creator("eosnationftw");
     * console.log(response);
     * // => { account: 'eosnationftw', creator: 'gyztcmrvgqge', timestamp: '2018-06-10T13:06:43.500', ... }
     */
    public get_creator(account: string) {
        const params = {
            account,
        };
        return this.get<GetAccountCreator>(V2_GET_CREATOR, params);
    }

    /**
     * [GET/v2/state/get_key_accounts](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_key_accounts)
     *
     * get account by public key
     *
     * @param {string} public_key Contract account targeted by the action.
     * @returns {Promise<GetKeyAccounts>} key accounts
     * @example
     *
     * const response = await rpc.get_key_accounts("EOS5Mto3Km6BCVxowb6LkkFaT9oaUwLVgswgcxvY4Qgc4rhHry4Tv");
     * console.log(response.account_names);
     * // => [ 'eoscafeblock' ]
     */
    public get_key_accounts(public_key: string) {
        const params = {
            public_key,
        };
        return this.get<GetKeyAccounts>(V2_GET_KEY_ACCOUNTS, params);
    }

    /**
     * [GET /v2/state/get_tokens](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_tokens)
     *
     * get tokens
     *
     * @param {string} account account
     * @returns {Promise<GetTokens>} get tokens
     * @example
     *
     * const response = await rpc.get_tokens("eosnationftw");
     * for (const token of response.tokens) {
     *     console.log(token);
     *     // => { symbol: 'ZOS', precision: 4, amount: 140, contract: 'zosdiscounts' }
     * }
     */
    public get_tokens(account: string) {
        const params = {
            account,
        };
        return this.get<any>(V2_GET_TOKENS, params);
    }

    /**
     * [GET /v2/history/get_transacted_accounts](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_transacted_accounts)
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
     * @returns {Promise<GetTransactedAccounts>} transacted accounts
     * @example
     *
     * const response = await rpc.get_transacted_accounts("eoscafeblock", "in");
     * console.log(response);
     * // => { query_time: 268, account: 'eoscafeblock', total_in: 1092369.1827, inputs: [ ... ] }
     */
    public get_transacted_accounts(account: string, direction: string, options: {
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
        return this.get<GetTransactedAccounts>(V2_GET_TRANSACTED_ACCOUNTS, params);
    }

    /**
     * [GET /v2/history/get_transaction](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_transaction)
     *
     * get all actions belonging to the same transaction
     *
     * @param {string} id transaction id
     * @returns {Promise<GetTransaction>} transaction
     * @example
     *
     * const response = await rpc.get_transaction("42dacd5722001b734be46a2140917e06cd21d42425f927f506c07b4388b07f62");
     * for (const action of response.actions) {
     *     console.log(action);
     *     // => { act: { account: 'eosio', name: 'buyrambytes', ... }}
     * }
     */
    public get_transaction(id: string) {
        const params = {
            id,
        };
        return this.get<GetTransaction>(V2_GET_TRANSACTION, params);
    }

    /**
     * [GET /v2/history/get_transfers](https://br.eosrio.io/v2/history/docs/index.html#/v2/get_v2_history_get_transfers)
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
     * @returns {Promise<GetTransfers>} transfers
     * @example
     *
     * const response = await rpc.get_transfers({to: "eosnewyorkio"});
     * for (const action of response.actions) {
     *     console.log(action.act.data);
     *     // => { from: 'eosio.bpay', to: 'eosnewyorkio', amount: 326.524, symbol: 'EOS', memo: 'producer block pay' }
     * }
     */
    public get_transfers(options: {
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
        return this.get<GetTransfers>(V2_GET_TRANSFERS, params);
    }
}
