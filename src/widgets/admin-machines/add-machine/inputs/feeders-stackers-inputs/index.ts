import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {digitalPrinting} from "@/widgets/admin-machines/add-machine/inputs/feeders-stackers-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/admin-machines/add-machine/inputs/feeders-stackers-inputs/ofsset-printing";

const getCategoryFeedersStackersInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        default:
            return []
    }
}

export {getCategoryFeedersStackersInputs};