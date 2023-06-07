import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/media-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/media-inputs/ofsset-printing";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/media-inputs/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/media-inputs/flexo-printing";
import {rollWidePrinting} from "@/widgets/machines/utils/attributes/media-inputs/roll-wide-printing";
import {flatbedWidePrinting} from "@/widgets/machines/utils/attributes/media-inputs/flatbed-wide-printing";
import {laminationMachine} from "@/widgets/machines/utils/attributes/media-inputs/lamination-machine";
import {punchingMachine} from "@/widgets/machines/utils/attributes/media-inputs/punching-machine";
import {roundingCornersMachine} from "@/widgets/machines/utils/attributes/media-inputs/rounding-corners-machine";

const getCategoryMediaInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrinting(state);
        case ECategoryId.FLEXO_PRINTING:
            return flexoPrinting(state);
        case ECategoryId.ROLL_WIDE_PRINTING:
            return rollWidePrinting(state);
        case ECategoryId.FLATBED_WIDE_PRINTING:
            return flatbedWidePrinting(state);
        case ECategoryId.LAMINATION_MACHINE:
            return laminationMachine(state);
        case ECategoryId.PUNCHING_MACHINE:
            return punchingMachine(state);
        case ECategoryId.ROUNDING_CORNERS_MACHINE:
            return roundingCornersMachine(state);
        default:
            return []
    }
}

export {getCategoryMediaInputs};