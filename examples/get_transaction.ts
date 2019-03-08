import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_transaction("42dacd5722001b734be46a2140917e06cd21d42425f927f506c07b4388b07f62");
    for (const action of response.actions) {
        console.log(action);
        // => { act: { account: 'eosio', name: 'buyrambytes', ... }}
    }

})().catch((e) => { console.log(e); });
