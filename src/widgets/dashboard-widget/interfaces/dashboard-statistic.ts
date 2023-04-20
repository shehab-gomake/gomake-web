export interface IDashboardStatistic {

    progress: IStatisticValue;
    faults: IStatisticValue;
    done: IStatisticValue;
    inProcess: IStatisticValue;
    new: IStatisticValue;
    waiting: IStatisticValue;
}

export interface IStatisticValue {
    labelTranslationKey: string;
    value: number;
    progress?: number;
}