import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/coating-inputs/ofsset-printing";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/coating-inputs/roll-digital-printing";

const getCategoryCoatingInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrinting(state)
        default:
            return []
    }
}

export {getCategoryCoatingInputs};