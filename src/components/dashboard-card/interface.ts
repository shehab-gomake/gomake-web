
import {EStatus} from "@/shared";

export interface IDashboardCard {
    label: string;
    value: number;
    bgColor: string;
    children?: JSX.Element;
    progressValue?: number;
    withProgressBar?: boolean;
    status?: EStatus;
}