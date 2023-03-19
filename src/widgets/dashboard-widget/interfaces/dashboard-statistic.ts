export interface IDashboardStatistic {

    progress: IStatisticValue;
    faults: IStatisticValue;
    done: IStatisticValue;
    inProcess: IStatisticValue;
    new: IStatisticValue;

}

export interface IStatisticValue {
    label: string;
    value: number;
    progress?: number;
}