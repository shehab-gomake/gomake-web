export interface IMachine {
    id: string;
    name: string;
    checked?: boolean;

    progress?: IMachineProgress
}

export interface IMachineProgress {
    totalTime: number;
    doneTime: number;
    name?:string;
    doneJobsCount: number;
    totalJobsCount: number;
}

export interface IDashboardColumns {
    id: string;
    name: number;
}