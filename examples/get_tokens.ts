import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_tokens("eosnationftw");
    for (const token of response.tokens) {
        console.log(token);
        // => { symbol: 'ZOS', precision: 4, amount: 140, contract: 'zosdiscounts' }
    }

})().catch((e) => { console.log(e); });
