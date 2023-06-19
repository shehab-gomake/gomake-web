import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/ofsset-printing";
import {
    digitalEnhancementMachine
} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/digital-enhancement-machine";
import {
    analogEnhancementMachine
} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/analog-enhancement-machine";

const getCategoryFeedersStackersInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return digitalEnhancementMachine(state);
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return analogEnhancementMachine(state);
        default:
            return []
    }
}

export {getCategoryFeedersStackersInputs};