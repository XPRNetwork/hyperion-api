# Hyperion HTTP API Javascript library

## Installation

Using Yarn:

```
yarn add @jafri/hyperion
```

or using NPM:

```
npm install --save @jafri/hyperion
```

## Quick Start

**CommonJS**

```js
const { JsonRpc } = require("@jafri/hyperion")
const fetch = require("isomorphic-fetch")

const endpoint = "https://br.eosrio.io"
const rpc = new JsonRpc(endpoint, { fetch })
```

**TypeScript**

```ts
import { JsonRpc } from "@jafri/hyperion"
import fetch from "isomorphic-fetch"

const endpoint = "https://br.eosrio.io"
const rpc = new JsonRpc(endpoint, { fetch })
```

## ENV Variables

```bash
HYPERION_ENDPOINT=<Enter Hyperion Endpoint>  # "https://br.eosrio.io"
```

## Supported Endpoints
```
/v2/history/alive
/v2/history/get_abi_snapshot
/v2/history/get_actions
/v2/history/get_key_accounts
/v2/history/get_transacted_accounts
/v2/history/get_transaction
/v2/history/get_transfers
/v2/history/get_creator
/v2/history/get_tokens
```