import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_transacted_accounts("eoscafeblock", "in");
    console.log(response);
    // => { query_time: 268, account: 'eoscafeblock', total_in: 1092369.1827, inputs: [ ... ] }

})().catch((e) => { console.log(e); });
