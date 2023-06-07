import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {
    digitalPrinting,
    ESpeedInputMethods
} from "@/widgets/machines/utils/attributes/speed-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/ofsset-printing";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/flexo-printing";
import {rollWidePrinting} from "@/widgets/machines/utils/attributes/speed-inputs/roll-wide-printing";
import {flatbedWidePrinting} from "@/widgets/machines/utils/attributes/speed-inputs/flatbed-wide-printing";
import {laminationMachine} from "@/widgets/machines/utils/attributes/speed-inputs/lamination-machine";
import {punchingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/punching-machine";
import {roundingCornersMachine} from "@/widgets/machines/utils/attributes/speed-inputs/rounding-corners-machine";

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
            return (method: ESpeedInputMethods): any[] => { return []};
    }
}

export {getCategorySpeedInputs};