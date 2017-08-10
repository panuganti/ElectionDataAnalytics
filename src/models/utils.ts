export class Utils {
    public static getPreviousElectionYear(year: number) : number {
        switch(year) {
            case 2014: return 2013;
            case 2013: return 2009;
            case 2009: return 2008;
            case 2008: return 2004;
            case 2004: return 1999;
            default: return 0;
        }
    }
}