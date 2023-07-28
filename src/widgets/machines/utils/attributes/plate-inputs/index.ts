import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/plate-inputs/ofsset-printing";

const getCategoryPlateInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        default:
            return [];
    }
}

export {getCategoryPlateInputs};