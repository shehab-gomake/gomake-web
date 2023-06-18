import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/beats-inputs/digital-printing";
import {digitalEnhancementMachine} from "@/widgets/machines/utils/attributes/beats-inputs/digital-enhancement-machine";

const getCategoryBeatsInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return digitalEnhancementMachine(state);
        default:
            return [];
    }
}

export {getCategoryBeatsInputs};