import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {
    digitalPrinting,
    ESpeedInputMethods
} from "@/widgets/machines/utils/attributes/speed-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/ofsset-printing";
import {flatbedWidePrinting} from "@/widgets/machines/utils/attributes/speed-inputs/flatbed-wide-printing";
import {laminationMachine} from "@/widgets/machines/utils/attributes/speed-inputs/lamination-machine";
import {punchingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/punching-machine";
import {roundingCornersMachine} from "@/widgets/machines/utils/attributes/speed-inputs/rounding-corners-machine";
import {foldingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/folding-machine";
import {pastingBlocksMachine} from "@/widgets/machines/utils/attributes/speed-inputs/pasting-blocks-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/speed-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/speed-inputs/perforation-machine";
import {foldingGluingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/folding-gluing-machine";
import {analogEnhancementMachine} from "@/widgets/machines/utils/attributes/speed-inputs/analog-enhancement-machine";

const getCategorySpeedOptionsInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.FLATBED_WIDE_PRINTING:
            return flatbedWidePrinting(state);
        case ECategoryId.LAMINATION_MACHINE:
            return laminationMachine(state);
        case ECategoryId.PUNCHING_MACHINE:
            return punchingMachine(state);
        case ECategoryId.ROUNDING_CORNERS_MACHINE:
            return roundingCornersMachine(state);
        case ECategoryId.FOLDING_MACHINE:
            return foldingMachine(state);
        case ECategoryId.PASTING_BLOCKS_MACHINE:
            return pastingBlocksMachine(state);
        case ECategoryId.SCORING_MACHINE:
            return scoringMachine(state);
        case ECategoryId.PERFORATION_MACHINE:
            return perforationMachine(state);
        case ECategoryId.FOLDING_GLUING_MACHINE:
            return foldingGluingMachine(state);
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return analogEnhancementMachine(state);
        default:
            return (method: ESpeedInputMethods): any[] => { return []};
    }
}

export {getCategorySpeedOptionsInputs};