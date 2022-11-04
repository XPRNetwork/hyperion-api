import { JsonRpc } from "../";

const endpoint = process.env.HYPERION_ENDPOINT || "https://jungle3.cryptolions.io";

const rpc = new JsonRpc(endpoint);

test("jsonrpc.alive", async () => {
  const response = await rpc.alive();
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_abi_snapshot", async () => {
  const response = await rpc.get_abi_snapshot("eosio", 200);
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_links", async () => {
  const response = await rpc.get_links("eosio");
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_proposals", async () => {
  const response = await rpc.get_proposals({ proposer: "eosio" });
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_actions", async () => {
  jest.setTimeout(10000)

  const response = await rpc.get_actions("eoscafeblock", {
    filter: "eosio.token:*",
    skip: 100,
    limit: 100,
  });
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_creator", async () => {
  const response = await rpc.get_creator("eosnationftw");
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_voters", async () => {
  const response = await rpc.get_voters({
    producer: "eoscafeblock",
    limit: 100,
  });
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_key_accounts", async () => {
  const response = await rpc.get_key_accounts(
    "EOS5Mto3Km6BCVxowb6LkkFaT9oaUwLVgswgcxvY4Qgc4rhHry4Tv"
  );
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_tokens", async () => {
  const response = await rpc.get_tokens("eosnationftw");
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_transaction", async () => {
  const response = await rpc.get_transaction(
    "42dacd5722001b734be46a2140917e06cd21d42425f927f506c07b4388b07f62"
  );
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_creator", async () => {
  const response = await rpc.get_creator("eosio");
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_deltas", async () => {
  const response = await rpc.get_deltas(
    "eosio.token",
    "eosnationftw",
    "accounts",
    "eosnationftw"
  );
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_table_state", async () => {
  const response = await rpc.get_table_state("eosio.token", "stat", 1000, "");
  expect(!!response).toBeTruthy();
});

test("jsonrpc.get_created_accounts", async () => {
  const response = await rpc.get_created_accounts("eosnationftw");
  expect(!!response).toBeTruthy();
});
