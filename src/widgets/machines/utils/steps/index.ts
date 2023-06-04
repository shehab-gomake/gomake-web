import {printingMachineSteps} from "@/widgets/machines/utils/steps/digital-printing-steps";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {ofssetPrintingSteps} from "@/widgets/machines/utils/steps/ofsset-printing-steps";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

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