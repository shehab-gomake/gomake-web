export interface IMachine {
    id: string;
    name: string;
    checked?: boolean;

    progress?: IMachineProgress
}

export interface IMachineProgress {
    total: number;
    done: number;
}