import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/blanket-cylinder-inputs/ofsset-printing";

const getCategoryBlanketCylinderInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        default:
            return [];
    }
}

export {getCategoryBlanketCylinderInputs};