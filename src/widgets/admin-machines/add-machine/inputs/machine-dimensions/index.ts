import {digitalPrinting} from "@/widgets/admin-machines/add-machine/inputs/machine-dimensions/digital-printing";
import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";

const getCategoryMachineDimensionsInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return digitalPrinting(state);
        default:
            return []
    }
}

export {getCategoryMachineDimensionsInputs};