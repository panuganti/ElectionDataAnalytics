import { Survey } from './survey';
import * as Enumerable from 'linq';
import { SurveyCollection, SurveyVotes } from './surveyCollection';

export class Prediction {
    constructor() {
    }

    
    predictWinner(surveyCollection: SurveyCollection, demographics: Survey): string {
        let votes = [0, 0, 0, 100];
        votes[0] = this.calculateVotes(surveyCollection.bjpSurvey, demographics);
        votes[1] = this.calculateVotes(surveyCollection.congSurvey, demographics);
        votes[2] = this.calculateVotes(surveyCollection.jdsSurvey, demographics);
        votes[3] = 100 - (votes[0] + votes[1] + votes[2]);
        return this.getWinner(votes);
    }

    getWinner(votes: number[]) {
    let parties = ["Bharatiya Janata Party", "Indian National Congress", "Janata Dal (secular)", "Others"];
        let index = Enumerable.from(votes)
            .select((value, index) => { return { "Value": value, "Index": index }; })
            .aggregate((a, b) => (a.Value > b.Value) ? a : b).Index;
        return parties[index];
    }

    getUpdatedSurveyAndVotes(changed: string, changedSurvey: Survey, surveyCollection: SurveyCollection, demographics: Survey) : SurveyVotes {
        switch(changed) {
            case 'gender': 
                return this.genderVotesChanged(changedSurvey, surveyCollection, demographics);
            case 'age': 
                return this.ageVotesChanged(changedSurvey, surveyCollection, demographics);
            case 'income': 
                return this.incomeVotesChanged(changedSurvey, surveyCollection, demographics);
            case 'community':
                return this.communityVotesChanged(changedSurvey, surveyCollection, demographics);
        }
    }

    calculateVotes(survey: Survey, demographics: Survey): number {
        return this.calculateVotesBasedOnCommunity(survey, demographics);
    }

    calculateVotesBasedOnCommunity(survey: Survey, demographics: Survey): number {
        let votes = 0;
        votes += demographics.brahmin * survey.brahmin / 100;
        votes += demographics.christian * survey.christian / 100;
        votes += demographics.dalit * survey.dalit / 100;
        votes += demographics.h * survey.h / 100;
        votes += demographics.kuruba * survey.kuruba / 100;
        votes += demographics.lingayat * survey.lingayat / 100;
        votes += demographics.muslim * survey.muslim / 100;
        votes += demographics.obc * survey.obc / 100;
        votes += demographics.uc * survey.uc / 100;
        votes += demographics.vokkaliga * survey.vokkaliga / 100;
        return votes;
    }

    calculateVotesBasedOnAge(survey: Survey, demographics: Survey): number {
        let votes = 0;
        votes += demographics._18To24 * survey._18To24 / 100;
        votes += demographics._25To34 * survey._25To34 / 100;
        votes += demographics._35To44 * survey._35To44 / 100;
        votes += demographics._45To60 * survey._45To60 / 100;
        votes += demographics._gt60 * survey._gt60 / 100;
        return votes;
    }

    calculateVotesBasedOnIncome(survey: Survey, demographics: Survey): number {
        let votes = 0;
        votes += demographics._lt10k * survey._lt10k / 100;
        votes += demographics._10kTo20k * survey._10kTo20k / 100;
        votes += demographics._20kTo40k * survey._20kTo40k / 100;
        votes += demographics._40kTo1Lac * survey._40kTo1Lac / 100;
        votes += demographics._gt1Lac * survey._gt1Lac / 100;
        return votes;
    }

    calculateVotesBasedOnGender(survey: Survey, demographics: Survey): number {
        let votes = 0;
        votes += demographics.men * survey.men / 100;
        votes += demographics.women * survey.women / 100;
        return votes;
    }

    computeChangedVotes(changedBjpVotes, votes: number[]): number[] {
        let changedVotes = [0, 0, 0, 0];
        changedVotes[0] = changedBjpVotes;
        let delta = changedBjpVotes - votes[0];
        changedVotes[1] = votes[1] - (delta * votes[1]) / (votes[1] + votes[2] + votes[3]);
        changedVotes[2] = votes[2] - (delta * votes[2]) / (votes[1] + votes[2] + votes[3]);
        changedVotes[3] = votes[3] - (delta * votes[3]) / (votes[1] + votes[2] + votes[3]);
        return changedVotes;
    }

    genderVotesChanged(changedSurvey: Survey, surveyCollection: SurveyCollection, demographics: Survey) : SurveyVotes {
        let votes = [0,0,0,0];
        let changedBjpVotes = this.calculateVotesBasedOnGender(changedSurvey, demographics);
        votes[0] = this.calculateVotesBasedOnGender(surveyCollection.bjpSurvey, demographics);
        votes[1] = this.calculateVotesBasedOnGender(surveyCollection.congSurvey, demographics);
        votes[2] = this.calculateVotesBasedOnGender(surveyCollection.jdsSurvey, demographics);
        votes[3] = 100 - (votes[0] + votes[1] + votes[3]);
        let changedVotes = this.computeChangedVotes(changedBjpVotes, votes);

        let delta = changedVotes[0] - votes[0];
        changedSurvey = this.updateAgeSurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateCommunitySurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateIncomeSurvey(delta, changedSurvey, demographics);
        return {"survey": changedSurvey, "votes": changedVotes};
    }

    ageVotesChanged(changedSurvey: Survey, surveyCollection: SurveyCollection, demographics: Survey) : SurveyVotes {
        let votes = [0,0,0,0];
        let changedBjpVotes = this.calculateVotesBasedOnAge(changedSurvey, demographics);
        votes[0] = this.calculateVotesBasedOnAge(surveyCollection.bjpSurvey, demographics);
        votes[1] = this.calculateVotesBasedOnAge(surveyCollection.congSurvey, demographics);
        votes[2] = this.calculateVotesBasedOnAge(surveyCollection.jdsSurvey, demographics);
        votes[3] = 100 - (votes[0] + votes[1] + votes[3]);
        let changedVotes = this.computeChangedVotes(changedBjpVotes, votes);

        let delta = changedVotes[0] - votes[0];
        changedSurvey = this.updateCommunitySurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateGenderSurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateIncomeSurvey(delta, changedSurvey, demographics);
        return {"survey": changedSurvey, "votes": changedVotes};
    }

    communityVotesChanged(changedSurvey: Survey, surveyCollection: SurveyCollection, demographics: Survey) : SurveyVotes {
        let votes = [0,0,0,0];
        let changedBjpVotes = this.calculateVotesBasedOnCommunity(changedSurvey, demographics);
        votes[0] = this.calculateVotesBasedOnCommunity(surveyCollection.bjpSurvey, demographics);
        votes[1] = this.calculateVotesBasedOnCommunity(surveyCollection.congSurvey, demographics);
        votes[2] = this.calculateVotesBasedOnCommunity(surveyCollection.jdsSurvey, demographics);
        votes[3] = 100 - (votes[0] + votes[1] + votes[3]);
        let changedVotes = this.computeChangedVotes(changedBjpVotes, votes);

        let delta = changedVotes[0] - votes[0];
        changedSurvey = this.updateAgeSurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateGenderSurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateIncomeSurvey(delta, changedSurvey, demographics);
        return {"survey": changedSurvey, "votes": changedVotes};
    }

    incomeVotesChanged(changedSurvey: Survey, surveyCollection: SurveyCollection, demographics: Survey) : SurveyVotes {
        let votes = [0,0,0,0];
        let changedBjpVotes = this.calculateVotesBasedOnIncome(changedSurvey, demographics);
        votes[0] = this.calculateVotesBasedOnIncome(surveyCollection.bjpSurvey, demographics);
        votes[1] = this.calculateVotesBasedOnIncome(surveyCollection.congSurvey, demographics);
        votes[2] = this.calculateVotesBasedOnIncome(surveyCollection.jdsSurvey, demographics);
        votes[3] = 100 - (votes[0] + votes[1] + votes[3]);
        let changedVotes = this.computeChangedVotes(changedBjpVotes, votes);

        let delta = changedVotes[0] - votes[0];
        changedSurvey = this.updateAgeSurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateGenderSurvey(delta, changedSurvey, demographics);
        changedSurvey = this.updateCommunitySurvey(delta, changedSurvey, demographics);
        return {"survey": changedSurvey, "votes": changedVotes};
    }

    updateGenderSurvey(delta, changedSurvey: Survey, demographics: Survey) : Survey {
        changedSurvey.men += delta * demographics.men / 100;
        changedSurvey.men += delta * demographics.women / 100;
        return changedSurvey;
    }

    updateCommunitySurvey(delta, changedSurvey: Survey, demographics: Survey) : Survey {
        changedSurvey.brahmin += delta * demographics.brahmin / 100;
        changedSurvey.christian += delta * demographics.christian / 100;
        changedSurvey.dalit += delta * demographics.dalit / 100;
        changedSurvey.h += delta * demographics.h / 100;
        changedSurvey.kuruba += delta * demographics.kuruba / 100;
        changedSurvey.lingayat += delta * demographics.lingayat / 100;
        changedSurvey.muslim += delta * demographics.muslim / 100;
        changedSurvey.obc += delta * demographics.obc / 100;
        changedSurvey.uc += delta * demographics.uc / 100;
        changedSurvey.vokkaliga += delta * demographics.vokkaliga / 100;
        return changedSurvey;
    }

    updateAgeSurvey(delta, changedSurvey: Survey, demographics: Survey) : Survey {
         changedSurvey._18To24 += delta * demographics._18To24 / 100;
         changedSurvey._25To34 += delta * demographics._25To34 / 100;
         changedSurvey._35To44 += delta * demographics._35To44 / 100;
         changedSurvey._45To60 += delta * demographics._45To60 / 100;
         changedSurvey._gt60 += delta * demographics._gt60 / 100;
         return changedSurvey;
    }

    updateIncomeSurvey(delta, changedSurvey: Survey, demographics: Survey) : Survey {
        changedSurvey._lt10k += delta * demographics._lt10k / 100;
        changedSurvey._10kTo20k += delta * demographics._10kTo20k / 100;
        changedSurvey._20kTo40k += delta * demographics._20kTo40k / 100;
        changedSurvey._40kTo1Lac += delta * demographics._40kTo1Lac / 100;
        changedSurvey._gt1Lac += delta * demographics._gt1Lac / 100;
        return changedSurvey;
    }
}