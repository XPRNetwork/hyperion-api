import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_key_accounts("EOS5Mto3Km6BCVxowb6LkkFaT9oaUwLVgswgcxvY4Qgc4rhHry4Tv");
    console.log(response.account_names);
    // => [ 'eoscafeblock' ]

})().catch((e) => { console.log(e); });
