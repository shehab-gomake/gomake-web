import {printingMachineSteps} from "@/widgets/admin-machines/add-machine/steps/digital-printing-steps";
import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {demoMachineSteps} from "@/widgets/admin-machines/add-machine/steps/demo-printing-steps";
import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";

const getSteps = (categoryId: ECategoryId): IStep[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return printingMachineSteps;
        case ECategoryId.CATEGORY2:
            return demoMachineSteps;
        default:
            return []
    }
}

export {getSteps};