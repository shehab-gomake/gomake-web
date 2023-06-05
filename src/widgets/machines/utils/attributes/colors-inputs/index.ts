import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/ofsset-printing";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/flexo-printing";

const getCategoryColorsInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrinting(state);
        case ECategoryId.FLEXO_PRINTING:
            return flexoPrinting(state);
        default:
            return []
    }
}

export {getCategoryColorsInputs};