import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/coating-inputs/ofsset-printing";

const getCategoryCoatingInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state)
        default:
            return []
    }
}

export {getCategoryCoatingInputs};