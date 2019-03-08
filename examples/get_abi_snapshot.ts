import { rpc } from "./rpc";

(async () => {
    const response = await rpc.get_abi_snapshot("eosio", 200);
    console.log(response.version);
    // => "eosio::abi/1.0"

    for (const table of response.tables) {
        console.log(table);
        // => { name: 'producers', index_type: 'i64', key_names: [ 'owner' ], key_types: [ 'uint64' ], type: 'producer_info' }
    }

})().catch((e) => { console.log(e); });
