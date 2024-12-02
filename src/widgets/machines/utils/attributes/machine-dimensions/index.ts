import {digitalPrinting} from "@/widgets/machines/utils/attributes/machine-dimensions/digital-printing";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {lightBoxes} from "@/widgets/machines/utils/attributes/machine-dimensions/light-boxes";

const getCategoryMachineDimensionsInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.LIGHT_BOXES_LETTER_ASSEMBLY:
            return lightBoxes(state);
        default:
            return digitalPrinting(state)
    }
}

export {getCategoryMachineDimensionsInputs};