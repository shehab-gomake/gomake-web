import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/ofsset-printing";
import {
    enhancementMachine
} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/enhancement-machine";

const getCategoryFeedersStackersInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return enhancementMachine(state);
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return enhancementMachine(state);
        default:
            return []
    }
}

export {getCategoryFeedersStackersInputs};