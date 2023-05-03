import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/admin-machines/add-machine/inputs/plate-inputs/ofsset-printing";

const getCategoryPlateInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        default:
            return [];
    }
}

export {getCategoryPlateInputs};