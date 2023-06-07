import {digitalPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/digital-printing";
import {ECategoryId} from "@/widgets/machines/enums/category-id";


const getCategoryConnectionInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);

        default:
            return []
    }
}

export {getCategoryConnectionInputs};