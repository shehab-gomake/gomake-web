import {printingMachineSteps} from "@/widgets/machines/utils/steps/digital-printing-steps";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {ofssetPrintingSteps} from "@/widgets/machines/utils/steps/ofsset-printing-steps";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {rollDigitalPrintingSteps} from "@/widgets/machines/utils/steps/roll-digital-printing-steps";

const getSteps = (categoryId: ECategoryId): IStep[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return printingMachineSteps;
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrintingSteps;
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrintingSteps
        default:
            return []
    }
}

export {getSteps};