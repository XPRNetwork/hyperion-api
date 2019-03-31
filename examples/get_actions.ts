import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_actions({
        account: "eoscafeblock",
        filter: "eosio.token:*",
        skip: 100,
        limit: 100,
    });
    for (const action of response.actions) {
        console.log(action);
        // => { act: { account: 'eosio.token', name: 'transfer', ... } }
    }

})().catch((e) => { console.log(e); });
