import {IStepFormProps} from "@/widgets/machines/utils/forms/interface";

export interface IStep {
    label: string;
    component: (props: IStepFormProps) => JSX.Element;
    icon?: any;
}