import { Survey } from './survey';
import * as Enumerable from 'linq';

export class Prediction {
    constructor(private changedSurvey: Survey, private bjpSurvey: Survey,
        private congSurvey: Survey, private jdsSurvey: Survey, private demographics: Survey) {
    }

    parties = ["Bharatiya Janata Party", "Indian National Congress", "Janata Dal (secular)", "Others"];

    predictWinner(): string {
        let votes = [0, 0, 0, 100];
        votes[0] = this.calculateVotes(this.bjpSurvey);
        votes[1] = this.calculateVotes(this.congSurvey);
        votes[2] = this.calculateVotes(this.jdsSurvey);
        votes[3] = 100 - (votes[0] + votes[1] + votes[2]);

        let index = Enumerable.from(votes)
            .select((value, index) => { return { "Value": value, "Index": index }; })
            .aggregate((a, b) => (a.Value > b.Value) ? a : b).Index;
        return this.parties[index];
    }

    calculateVotes(survey: Survey) : number {
        return this.calculateVotesBasedOnCommunity(survey);
    }

    calculateVotesBasedOnCommunity(survey: Survey): number {
        let votes = 0;
        votes += this.demographics.brahmin * survey.brahmin;
        votes += this.demographics.christian * survey.christian;
        votes += this.demographics.dalit * survey.dalit;
        votes += this.demographics.h * survey.h;
        votes += this.demographics.kuruba * survey.kuruba;
        votes += this.demographics.lingayat * survey.lingayat;
        votes += this.demographics.muslim * survey.muslim;
        votes += this.demographics.obc * survey.obc;
        votes += this.demographics.uc * survey.uc;
        votes += this.demographics.vokkaliga * survey.vokkaliga;
        return votes;
    }

    calculateVotesBasedOnAge(survey: Survey): number {
        let votes = 0;
        votes += this.demographics._18To24 * survey._18To24;
        votes += this.demographics._25To34 * survey._25To34;
        votes += this.demographics._35To44 * survey._35To44;
        votes += this.demographics._45To60 * survey._45To60;
        votes += this.demographics._gt60 * survey._gt60;
        return votes;
    }

    calculateVotesBasedOnIncome(survey: Survey): number {
        let votes = 0;
        votes += this.demographics._lt10k * survey._lt10k;
        votes += this.demographics._10kTo20k * survey._10kTo20k;
        votes += this.demographics._20kTo40k * survey._20kTo40k;
        votes += this.demographics._40kTo1Lac * survey._40kTo1Lac ;
        votes += this.demographics._gt1Lac * survey._gt1Lac;
        return votes;
    }

    calculateVotesBasedOnGender(survey: Survey): number {
        let votes = 0;
        votes += this.demographics.men * survey.men;
        votes += this.demographics.women * survey.women;
        return votes;
    }

    computeChangedVotes(changedBjpVotes, bjpVotes, congVotes, jdsVotes) : number {
        let othersVotes = 100 - (bjpVotes + congVotes + jdsVotes);
        let delta = changedBjpVotes - bjpVotes;   
        let changedCongVotes = congVotes - (delta * congVotes)/(congVotes + jdsVotes + othersVotes);
        let changedJdsVotes = jdsVotes - (delta * jdsVotes)/(congVotes + jdsVotes + othersVotes);
        let changedOthersVotes = othersVotes - (delta * othersVotes)/(congVotes + jdsVotes + othersVotes);
        return delta;
    }

    genderVotesChanged() {
        let changedBjpVotes = this.calculateVotesBasedOnGender(this.changedSurvey);
        let bjpVotes = this.calculateVotesBasedOnGender(this.bjpSurvey);
        let congVotes = this.calculateVotesBasedOnGender(this.congSurvey);
        let jdsVotes = this.calculateVotesBasedOnGender(this.jdsSurvey);
        let delta = this.computeChangedVotes(changedBjpVotes, bjpVotes, congVotes, jdsVotes);

        this.updateAgeVotes(delta);
        this.updateCommunityVotes(delta);
        this.updateIncomeVotes(delta);
    }

    ageVotesChanged() {
        let changedBjpVotes = this.calculateVotesBasedOnAge(this.changedSurvey);
        let bjpVotes = this.calculateVotesBasedOnAge(this.bjpSurvey);
        let congVotes = this.calculateVotesBasedOnAge(this.congSurvey);
        let jdsVotes = this.calculateVotesBasedOnAge(this.jdsSurvey);
        let delta = this.computeChangedVotes(changedBjpVotes, bjpVotes, congVotes, jdsVotes);

        this.updateGenderVotes(delta);
        this.updateCommunityVotes(delta);
        this.updateIncomeVotes(delta);
    }

    communityVotesChanged() { 
        let changedBjpVotes = this.calculateVotesBasedOnCommunity(this.changedSurvey);
        let bjpVotes = this.calculateVotesBasedOnCommunity(this.bjpSurvey);
        let congVotes = this.calculateVotesBasedOnCommunity(this.congSurvey);
        let jdsVotes = this.calculateVotesBasedOnCommunity(this.jdsSurvey);
        let delta = this.computeChangedVotes(changedBjpVotes, bjpVotes, congVotes, jdsVotes);        

        this.updateAgeVotes(delta);
        this.updateGenderVotes(delta);
        this.updateIncomeVotes(delta);
    }

    incomeVotesChanged() {
        let changedBjpVotes = this.calculateVotesBasedOnIncome(this.changedSurvey);
        let bjpVotes = this.calculateVotesBasedOnIncome(this.bjpSurvey);
        let congVotes = this.calculateVotesBasedOnIncome(this.congSurvey);
        let jdsVotes = this.calculateVotesBasedOnIncome(this.jdsSurvey);
        let delta = this.computeChangedVotes(changedBjpVotes, bjpVotes, congVotes, jdsVotes);        

        this.updateAgeVotes(delta);
        this.updateGenderVotes(delta);
        this.updateCommunityVotes(delta);
    }

     updateGenderVotes(delta) {
        this.bjpSurvey.men = this.bjpSurvey.men + delta * this.demographics.men;
        this.bjpSurvey.men = this.bjpSurvey.women + delta * this.demographics.women;
     }

     updateCommunityVotes(delta) {

     }

     updateAgeVotes(delta) {

     }

     updateIncomeVotes(delta) {

     }
}