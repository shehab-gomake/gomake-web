import {digitalPrinting} from "@/widgets/admin-machines/add-machine/inputs/basic-inputs/digital-printing";
import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/admin-machines/add-machine/inputs/basic-inputs/ofsset-printing";

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