import {printingMachineSteps} from "@/widgets/admin-machines/add-machine/steps/digital-printing-steps";
import {IStep} from "@/widgets/admin-machines/add-machine/interface/step";
import {ofssetPrintingSteps} from "@/widgets/admin-machines/add-machine/steps/ofsset-printing-steps";
import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";

const getSteps = (categoryId: ECategoryId): IStep[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return printingMachineSteps;
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrintingSteps;
        default:
            return []
    }
}

export {getSteps};