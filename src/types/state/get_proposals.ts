export interface GetProposals {
    query_time_ms: number;
    cached: boolean;
    total: {
      value: number,
      relation: string
    },
    proposals: Proposal[]
}

export interface Proposal {
  provided_approvals: Approval[],
  requested_approvals: Approval[],
  block_num: number;
  proposer: string;
  proposal_name: string;
  executed: boolean;
  primary_key: string;
}

export interface Approval {
  actor: string;
  permission: string;
  time: string;
}