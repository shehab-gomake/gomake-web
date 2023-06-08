import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {
    digitalPrinting,
    ESpeedInputMethods
} from "@/widgets/machines/utils/attributes/speed-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/ofsset-printing";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/flexo-printing";

const getCategorySpeedInputs = (categoryId: string, state: Record<string, any>) => {
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
            return (method: ESpeedInputMethods): any[] => { return []};
    }
}

export {getCategorySpeedInputs};