import {printingMachineSteps} from "@/widgets/admin-machines/add-machine/steps/digital-printing-steps";
import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {demoMachineSteps} from "@/widgets/admin-machines/add-machine/steps/demo-printing-steps";

const getSteps = (categoryId: string | undefined | string[]): IStep[] => {
    switch (categoryId) {
        case '1':
            return printingMachineSteps;
        case '2':
            return demoMachineSteps;
        default:
            return []
    }
}

export {getSteps};