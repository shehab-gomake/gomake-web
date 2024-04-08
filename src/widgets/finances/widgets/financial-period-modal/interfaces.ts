export type financialPeriod = {
    year: string;
    month: string;
    status: string;
};

export enum PeriodStatuses {
    Unlocked,
    UnlockedExceptSales,
    PeriodClosing,
    Locked,
}