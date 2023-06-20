
import React from "react";
import {EStatus} from "@/shared";

export interface IDashboardCard {
    label: string;
    value: number;
    bgColor: string;
    children?: React.ReactElement;
    progressValue?: number;
    withProgressBar?: boolean;
    status?: EStatus;
}