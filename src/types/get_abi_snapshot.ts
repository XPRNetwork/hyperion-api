export interface GetAbiSnapshot {
  version: string;
  types: Type[];
  structs: Struct[];
  actions: Action[];
  tables: Table[];
  ricardian_clauses: Ricardianclause[];
  error_messages: any[];
  abi_extensions: any[];
}

interface Ricardianclause {
  id: string;
  body: string;
}

interface Table {
  name: string;
  index_type: string;
  key_names: string[];
  key_types: string[];
  type: string;
}

interface Action {
  name: string;
  type: string;
  ricardian_contract: string;
}

interface Struct {
  name: string;
  base: string;
  fields: Field[];
}

interface Field {
  name: string;
  type: string;
}

interface Type {
  new_type_name: string;
  type: string;
}
