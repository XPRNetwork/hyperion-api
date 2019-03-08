import { rpc } from "./rpc";

(async () => {
    const response = await rpc.alive();
    console.log(response);
    // => { status: 'OK' }

})().catch((e) => { console.log(e); });
