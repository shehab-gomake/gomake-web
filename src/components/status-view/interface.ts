import {EStatus} from "@/shared";
import {CSSProperties} from "react";

export interface IStatusView {
    status: EStatus;
    style?:  CSSProperties | undefined;

    label?: string;
}