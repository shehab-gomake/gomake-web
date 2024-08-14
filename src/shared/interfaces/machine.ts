export interface IMachine {
    id: string;
    name: string;
    checked?: boolean;

    progress?: IMachineProgress
}

export interface IMachineProgress {
    total: number;
    done: number;
    name?:string;
}

export interface IDashboardColumns {
    id: string;
    name: number;
}