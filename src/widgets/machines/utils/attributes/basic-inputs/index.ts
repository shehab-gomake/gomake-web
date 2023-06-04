import {digitalPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/digital-printing";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/ofsset-printing";
import {rolldDigitalPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/roll-digital-printing";

const getCategoryBasicInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rolldDigitalPrinting(state)
        default:
            return []
    }
}

export {getCategoryBasicInputs};