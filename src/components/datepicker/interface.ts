import {IDateRange} from "@/shared";

export interface IGoMakeDatepicker {
    onChange: (dateRange: IDateRange) => void;
}