import * as Enumerable from 'linq';
import {CandidateVote} from './candidate-vote';

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

