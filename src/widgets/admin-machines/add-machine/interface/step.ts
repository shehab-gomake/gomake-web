import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";

export interface IStep {
    label: string;
    component: (props: IStepFormProps) => JSX.Element;
    icon?: any;
}