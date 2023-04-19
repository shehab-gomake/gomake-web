import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {digitalPrinting} from "@/widgets/admin-machines/add-machine/inputs/media-inputs/digital-printing";

const getCategoryMediaInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.CATEGORY2:
            return digitalPrinting(state);
        default:
            return []
    }
}

export {getCategoryMediaInputs};