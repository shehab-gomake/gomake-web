import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {
    digitalPrinting,
    ESpeedInputMethods
} from "@/widgets/admin-machines/add-machine/inputs/speed-inputs/digital-printing";

const getCategorySpeedInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.CATEGORY2:
            return digitalPrinting(state);
        default:
            return (method: ESpeedInputMethods): any[] => { return []};
    }
}

export {getCategorySpeedInputs};