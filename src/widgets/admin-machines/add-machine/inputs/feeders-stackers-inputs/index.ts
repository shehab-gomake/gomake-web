import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {digitalPrinting} from "@/widgets/admin-machines/add-machine/inputs/feeders-stackers-inputs/digital-printing";

const getCategoryFeedersStackersInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        default:
            return []
    }
}

export {getCategoryFeedersStackersInputs};