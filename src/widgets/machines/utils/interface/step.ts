import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {TMachineInput} from "@/widgets/machines/utils/interfaces-temp/inputs-interfaces";

export interface IStep {
    label: string;
    component: (props: IStepFormProps) => JSX.Element;
    icon?: any;
    inputs?: TMachineInput[]
}