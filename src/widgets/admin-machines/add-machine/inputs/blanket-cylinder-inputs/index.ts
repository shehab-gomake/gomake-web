import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/admin-machines/add-machine/inputs/blanket-cylinder-inputs/ofsset-printing";

const getCategoryBlanketCylinderInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        default:
            return [];
    }
}

export {getCategoryBlanketCylinderInputs};