import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";
import {digitalPrinting} from "@/widgets/admin-machines/add-machine/inputs/media-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/admin-machines/add-machine/inputs/media-inputs/ofsset-printing";

const getCategoryMediaInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        default:
            return []
    }
}

export {getCategoryMediaInputs};