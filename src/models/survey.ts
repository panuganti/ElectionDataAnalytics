export class Survey {
    men: number;
    women: number;

    lingayat: number;
    vokkaliga: number;
    kuruba: number;
    h: number;
    brahmin: number;
    dalit: number;
    uc: number;
    obc: number;
    muslim: number;
    christian: number;

    _18To24: number;
    _25To34: number;
    _35To44: number;
    _45To60: number;
    _gt60: number;

    _lt10k: number;
    _10kTo20k: number;
    _20kTo40k: number;
    _40kTo1Lac: number;
    _gt1Lac: number;

    constructor() {
    }

    public static clone(survey: Survey) : Survey {
        var obj = new Survey();
        obj.men = survey.men;
        obj.women = survey.women;

        obj.lingayat = survey.lingayat;
        obj.vokkaliga = survey.vokkaliga;
        obj.kuruba = survey.kuruba;
        obj.h = survey.h;
        obj.brahmin = survey.brahmin;
        obj.dalit = survey.dalit;
        obj.uc = survey.uc;
        obj.obc = survey.obc;
        obj.muslim = survey.muslim;
        obj.christian = survey.christian;

        obj._18To24 = survey._18To24;
        obj._25To34 = survey._25To34;
        obj._35To44 = survey._35To44;
        obj._45To60 = survey._45To60;
        obj._gt60 = survey._gt60;

        obj._lt10k = survey._lt10k;
        obj._10kTo20k = survey._10kTo20k;
        obj._20kTo40k = survey._20kTo40k;
        obj._40kTo1Lac = survey._40kTo1Lac;
        obj._gt1Lac = survey._gt1Lac;
        return obj;
    }
}