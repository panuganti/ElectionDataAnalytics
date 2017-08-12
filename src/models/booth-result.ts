export class BoothResult {
    Candidates: Candidate[];
    MarginOfVictory: number;
    AssemblyConstituency: string;
    ACId: string;
    BoothId: string;
}

export class Candidate {
    Name: string;
    Votes: number;
}
