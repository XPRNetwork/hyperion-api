/**
 * @private
 * @module RPC-Error
 *
 * copyright defined in eosjs/LICENSE.txt
 */
export class RpcError {
    public json: any;
    public message: string;

    constructor(json: any) {
        if (json.error && json.error.details && json.error.details.length && json.error.details[0].message) {
            this.message = json.error.details[0].message;
        } else if (json.processed && json.processed.except && json.processed.except.message) {
            this.message = json.processed.except.message;
        } else {
            this.message = json.message;
        }
        Object.setPrototypeOf(this, RpcError.prototype);
        this.json = json;
    }
}

/**
 * @private
 */
export class RpcStatusError {
    public response: any;
    public message: string;

    constructor(response: any) {
        if (response.status === 405) {
            this.message = response.statusText;
        } else {
            this.message = ''
        }

        Object.setPrototypeOf(this, RpcStatusError.prototype);
        this.response = response;
    }
}
