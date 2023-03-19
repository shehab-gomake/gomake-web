
import React from "react";

export interface IDashboardCard {
    label: string;
    value: number;
    bgColor: string;
    children?: React.ReactElement;
    progress?: number;
}