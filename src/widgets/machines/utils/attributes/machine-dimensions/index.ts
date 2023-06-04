import {digitalPrinting} from "@/widgets/machines/utils/attributes/machine-dimensions/digital-printing";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const getCategoryMachineDimensionsInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return digitalPrinting(state);
        default:
            return digitalPrinting(state)
    }
}

export {getCategoryMachineDimensionsInputs};