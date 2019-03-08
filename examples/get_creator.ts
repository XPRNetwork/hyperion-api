import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_creator("eosnationftw");
    console.log(response);
    // => { account: 'eosnationftw', creator: 'gyztcmrvgqge', timestamp: '2018-06-10T13:06:43.500', ... }

})().catch((e) => { console.log(e); });
