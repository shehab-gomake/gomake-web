import {digitalPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/digital-printing";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/ofsset-printing";

const getCategoryBasicInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        default:
            return []
    }
}

export {getCategoryBasicInputs};