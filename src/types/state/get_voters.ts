export interface GetVoters {
    query_time: number;
    voter_count: number;
    voters: Voter[];
}

export interface Voter {
    account: string;
    weight: number;
    last_vote: number;
}
