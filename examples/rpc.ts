import fetch from "isomorphic-fetch";
import { JsonRpc } from "..";

const endpoint = process.env.HYPERION_ENDPOINT || "https://br.eosrio.io";
export const rpc = new JsonRpc(endpoint, { fetch });
