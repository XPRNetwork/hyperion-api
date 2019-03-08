import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_transfers({to: "eosnewyorkio"});
    for (const action of response.actions) {
        console.log(action.act.data);
        // => { from: 'eosio.bpay', to: 'eosnewyorkio', amount: 326.524, symbol: 'EOS', memo: 'producer block pay' }
    }

})().catch((e) => { console.log(e); });
