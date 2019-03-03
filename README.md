# Hyperion HTTP API Javascript library

## Installation

Using Yarn:

```
yarn add hyperion-api
```

or using NPM:

```
npm install --save hyperion-api
```

## Quick Start

**CommonJS**

```js
const { JsonRpc } = require("hyperion-api")
const fetch = require("isomorphic-fetch")

const endpoint = "https://br.eosrio.io"
const rpc = new JsonRpc(endpoint, { fetch })
```

**TypeScript**

```ts
import { JsonRpc } from "hyperion-api"
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
```