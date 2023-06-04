import {IStep} from "@/widgets/machines/utils/interface/step";

export interface IMachineStepperProps {
    steps: IStep[];
    activeStep: number;
    previousStep: () => void;
    nextStep: () => void;
    actionButtonClicked: () => void;
    isAddForm: boolean;
}