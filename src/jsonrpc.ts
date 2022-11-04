import {
  V2_ALIVE,
  V2_GET_ABI_SNAPSHOT,
  V2_GET_ACTIONS,
  V2_GET_CREATOR,
  V2_GET_KEY_ACCOUNTS,
  V2_GET_TOKENS,
  V2_GET_TRANSACTED_ACCOUNTS,
  V2_GET_TRANSACTION,
  V2_GET_TRANSFERS,
  V2_GET_CREATED_ACCOUNTS,
  V2_GET_DELTAS,
  V2_GET_TABLE_STATE,
  V2_GET_VOTERS,
  V2_GET_LINKS,
  V2_GET_PROPOSALS,
} from "./endpoints";
import { RpcError, RpcStatusError } from "./rpcerror";
import {
  Alive,
  GetAbiSnapshot,
  GetVoters,
  GetCreatedAccounts,
  GetDeltas,
  GetTableState,
  GetCreator,
  GetActions,
  GetKeyAccounts,
  GetTokens,
  GetTransactedAccounts,
  GetTransaction,
  GetTransfers,
  GetLinks,
  GetProposals,
} from "./types/api";
require('isomorphic-fetch');
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';

function queryParams(params: { [key: string]: any }) {
  const entries = [];
  for (const key of Object.keys(params)) {
    const value = params[key];
    if (value !== undefined) {
      entries.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  }
  return entries.join("&");
}

async function fetchWithTimeout(
  resource: string,
  options: { [key: string]: any; timeout: number }
) {
  const { timeout } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...(options || {}),
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

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
  public timeout: number = 8000;

  constructor(endpoint: string, args: { timeout?: number } = {}) {
    this.endpoint = endpoint;

    if (args.timeout) {
      this.timeout = args.timeout;
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
    let json: any;
    try {
      response = await fetchWithTimeout(this.endpoint + path, {
        body: JSON.stringify(body),
        method: "POST",
        timeout: this.timeout,
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
    let json: any;
    const url = this.endpoint + path + "?" + queryParams(params);
    try {
      response = await fetchWithTimeout(url, {
        method: "GET",
        timeout: this.timeout,
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
   * [GET /v2/state/alive](https://eos.hyperion.eosrio.io/v2/docs/index.html#/state/get_v2_state_alive)
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
   * [GET /v2/history/get_abi_snapshot](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_abi_snapshot)
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
   * [GET /v2/state/get_voters](https://eos.hyperion.eosrio.io/v2/docs/index.html#/state/get_v2_state_get_voters)
   *
   * get voters
   *
   * @param {object} [options={}] Optional parameters
   * @param {string} [options.producer] filter by voted producer (comma separated)
   * @param {boolean} [options.proxy] true or false
   * @param {number} [options.skip] skip [n] actions (pagination)
   * @param {number} [options.limit] limit of [n] actions per page
   * @returns {Promise<GetVoters>} voters
   * @example
   *
   * const response = await rpc.get_voters({ producer: "eoscafeblock", limit: 100 });
   * console.log(response.voters);
   * // => "[{
   * //   "account": "guzdkmrtgage",
   * //   "weight": 78434695236505280,
   * //   "last_vote": 64804768
   * // }]"
   */
  public get_voters(options: any) {
    return this.get<GetVoters>(V2_GET_VOTERS, options);
  }

  /**
   * [GET /v2/state/get_links](https://eos.hyperion.eosrio.io/v2/docs/index.html#/state/get_v2_state_links)
   *
   * get voters
   *
   * @param {string} [account] account to get links for
   * @returns {Promise<GetLinks>} links
   * @example
   *
   * const response = await rpc.get_links("eoscafeblock");
   * console.log(response.links);
   * // => "[{
   * "block_num":26088072,
   * "timestamp":"2019-11-22T23:17:42.000",
   * "account":"eosriobrazil",
   * "permission":"claim2",
   * "code":"eosio",
   * "action":"voteproducer"
   * }]"
   */
  public get_links(account: string) {
    return this.get<GetLinks>(V2_GET_LINKS, { account });
  }

  /**
   * [GET /v2/state/get_proposals](https://eos.hyperion.eosrio.io/v2/docs/index.html#/state/get_v2_state_get_proposals)
   *
   * get proposals
   *
   * @param {string} [account] account to get proposals for
   * @param {object} [options={}] Optional parameters
   * @param {string} [options.proposer] filter by proposer
   * @param {string} [options.proposal] filter by proposal name
   * @param {string} [options.account] filter by either requested or provided account
   * @param {string} [options.requested] filter by requested account
   * @param {string} [options.provided] filter by provided account
   * @param {string} [options.track] total results to track (count) [number or true]
   * @param {number} [options.skip] skip [n] actions (pagination)
   * @param {number} [options.limit] limit of [n] actions per page
   * @returns {Promise<GetProposals>} proposals
   */
  public get_proposals(options: {
    proposer?: string;
    proposal?: string;
    account?: string;
    requested?: string;
    provided?: string;
    executed?: boolean;
    skip?: number;
    limit?: number;
  }) {
    return this.get<GetProposals>(V2_GET_PROPOSALS, options);
  }

  /**
   * [GET /v2/history/get_actions](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_actions)
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
  public get_actions<T>(
    account: string,
    options: {
      filter?: string;
      skip?: number;
      limit?: number;
      sort?: string;
      after?: string;
      before?: string;
      ["transfer.to"]?: string;
      ["transfer.from"]?: string;
      ["transfer.symbol"]?: string;
      ["act.name"]?: string;
      ["act.account"]?: string;
      block_num?: number;
    } = {}
  ) {
    const params = Object.assign({}, { account }, options);
    return this.get<GetActions<T>>(V2_GET_ACTIONS, params);
  }

  /**
   * [GET /v2/history/get_created_accounts](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_created_accounts)
   *
   * get created accounts
   *
   * @param {string} account created account
   * @returns {Promise<GetCreatedAccounts>} get creator
   * @example
   *
   * const response = await rpc.get_created_accounts("eosnationftw");
   * console.log(response);
   * // => {"accounts": [{"name":"eosnationdsp","trx_id":"728d4a4da36a98d9048080461dacaf975ad083e8158ef84edea60cc755ab2c1a","timestamp":"2019-02-28T22:36:45.000"}, ... ]}
   */
  public get_created_accounts(account: string) {
    const params = {
      account,
    };
    return this.get<GetCreatedAccounts>(V2_GET_CREATED_ACCOUNTS, params);
  }

  /**
   * [GET /v2/history/get_creator](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_creator)
   *
   * get creator
   *
   * @param {string} account created account
   * @returns {Promise<GetCreator>} get creator
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
    return this.get<GetCreator>(V2_GET_CREATOR, params);
  }

  /**
   * [GET /v2/history/get_deltas](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_deltas)
   *
   * get deltas
   *
   * @param {string} code contract account
   * @param {string} scope table scope
   * @param {string} table table name
   * @param {string} payer payer account
   * @returns {Promise<GetDeltas>} get deltas
   * @example
   *
   * const response = await rpc.get_deltas("eosio.token", "eosnationftw", "accounts", "eosnationftw");
   * console.log(response);
   * // => { "query_time": 19, "total": { "value": 486, "relation": "eq" }, "deltas": [ ... ] }
   */
  public get_deltas<T>(
    code?: string,
    scope?: string,
    table?: string,
    payer?: string,
    options?: any
  ) {
    const params = Object.assign({}, options, {
      code,
      scope,
      table,
      payer,
    });
    return this.get<GetDeltas<T>>(V2_GET_DELTAS, params);
  }

  /**
   * [GET /v2/history/get_table_state](https://eos.hyperion.eosrio.io/v2/docs/static/index.html#/history/get_v2_history_get_table_state
   *
   * get table state
   *
   * @param {string} code contract account
   * @param {string} table table name
   * @param {string} block_num target block
   * @param {string} after_key last key for pagination
   * @returns {Promise<GetTableState>} get table state
   * @example
   *
   * const response = await rpc.get_table_state("eosio.token", "stat", "1000", "");
   * console.log(response);
   * // => { "query_time": 19, "code": "eosio.token", "table": "stat", "block_num": 1000, "next_key": "........ehbo5-5459781",, "results": [ ... ] }
   */
  public get_table_state<T>(
    code: string,
    table: string,
    block_num?: number,
    after_key?: string
  ) {
    const params = {
      code,
      table,
      block_num,
      after_key,
    };
    return this.get<GetDeltas<T>>(V2_GET_TABLE_STATE, params);
  }

  /**
   * [GET/v2/state/get_key_accounts](https://eos.hyperion.eosrio.io/v2/docs/index.html#/state/get_v2_state_get_key_accounts)
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
   * [GET /v2/state/get_tokens](https://eos.hyperion.eosrio.io/v2/docs/index.html#/state/get_v2_state_get_tokens)
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
    return this.get<GetTokens>(V2_GET_TOKENS, params);
  }

  /**
   * [GET /v2/history/get_transacted_accounts](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_transacted_accounts)
   *
   * get all account that interacted with the source account provided
   *
   * @param {string} account source account
   * @param {string} direction search direction (in, out or both)
   * @returns {Promise<GetTransactedAccounts>} transacted accounts
   * @example
   *
   * const response = await rpc.get_transacted_accounts("eoscafeblock", "in");
   * console.log(response);
   * // => { query_time: 268, account: 'eoscafeblock', total_in: 1092369.1827, inputs: [ ... ] }
   */
  public get_transacted_accounts(
    account: string,
    direction: string,
    options: {
      symbol?: string;
      contract?: string;
      min?: number;
      max?: number;
      limit?: number;
    } = {}
  ) {
    const params = Object.assign({}, { account, direction }, options);
    return this.get<GetTransactedAccounts>(V2_GET_TRANSACTED_ACCOUNTS, params);
  }

  /**
   * [GET /v2/history/get_transaction](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_transaction)
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
  public get_transaction<T>(id: string) {
    const params = {
      id,
    };
    return this.get<GetTransaction<T>>(V2_GET_TRANSACTION, params);
  }

  /**
   * [GET /v2/history/get_transfers](https://eos.hyperion.eosrio.io/v2/docs/index.html#/history/get_v2_history_get_transfers)
   *
   * get token transfers utilizing the eosio.token standard
   *
   * @param {object} [options={}] Optional parameters
   * @param {string} [options.from] source account
   * @param {string} [options.to] destination account
   * @param {string} [options.symbol] token symbol
   * @param {string} [options.contract] token contract
   * @param {number} [options.skip] skip [n] actions (pagination)
   * @param {number} [options.limit] limit of [n] actions per page
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
  public get_transfers(
    options: {
      from?: string;
      to?: string;
      symbol?: string;
      contract?: string;
      skip?: number;
      limit?: number;
      after?: string;
      before?: string;
    } = {}
  ) {
    const params = Object.assign({}, options);
    return this.get<GetTransfers>(V2_GET_TRANSFERS, params);
  }
}
