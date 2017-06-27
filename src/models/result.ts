import * as Enumerable from 'linq';

export class Result {
    Id: number;
    Name: string;
    Votes: CandidateVote[];

    constructor() { }

    GetWinner(): string {
        var en = Enumerable.from(this.Votes);
        return en.first(t => t.Position == 1).Name;
    }

    GetWinningParty(): string {
        var en = Enumerable.from(this.Votes);
        return en.first(t => t.Position == 1).Party;
    }
}

export class CandidateVote {
    Votes: number;
    Position: number;
    Name: string;
    Party: string;
}

export class Distribution {
    AcNo: number;
    Percent: number;
}
