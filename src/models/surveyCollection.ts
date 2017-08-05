import { Survey } from './survey';
export class SurveyCollection {
    bjpSurvey: Survey;
    congSurvey: Survey;
    jdsSurvey: Survey;
}

export class SurveyVotes {
    survey: Survey;
    votes: number[];
}