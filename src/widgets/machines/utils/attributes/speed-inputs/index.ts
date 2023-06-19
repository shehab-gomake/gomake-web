import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/flexo-printing";
import {rollWidePrinting} from "@/widgets/machines/utils/attributes/speed-inputs/roll-wide-printing";
import {flatbedWidePrinting} from "@/widgets/machines/utils/attributes/speed-inputs/flatbed-wide-printing";
import {laminationMachine} from "@/widgets/machines/utils/attributes/speed-inputs/lamination-machine";
import {punchingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/punching-machine";
import {roundingCornersMachine} from "@/widgets/machines/utils/attributes/speed-inputs/rounding-corners-machine";
import {foldingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/folding-machine";
import {pastingBlocksMachine} from "@/widgets/machines/utils/attributes/speed-inputs/pasting-blocks-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/speed-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/speed-inputs/perforation-machine";
import {foldingGluingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/folding-gluing-machine";
import {digitalEnhancementMachine} from "@/widgets/machines/utils/attributes/speed-inputs/digital-enhancement-machine";
import {encapsulationMachine} from "@/widgets/machines/utils/attributes/speed-inputs/encapsulation-machine";
import {sideColoringMachine} from "@/widgets/machines/utils/attributes/speed-inputs/side-coloring-machine";
import {guillotineMachine} from "@/widgets/machines/utils/attributes/speed-inputs/guillotine-machine";
import {flatbedCuttingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/flatbed-cutting-machine";
import {rollbedCuttingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/rollbed-cutting-machine";
import {staplerMachine} from "@/widgets/machines/utils/attributes/speed-inputs/stapler-machine";
import {manualPeelingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/manual-peeling-machine";
import {piercingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/piercing-machine";
import {framingFixedFrameMachine} from "@/widgets/machines/utils/attributes/speed-inputs/framing-fixed-frame-machine";
import {customFrameMachine} from "@/widgets/machines/utils/attributes/speed-inputs/custom-frame-machine";
import {linkageMachine} from "@/widgets/machines/utils/attributes/speed-inputs/linkage-machine";
import {PVCBendingMachine} from "@/widgets/machines/utils/attributes/speed-inputs/PVC-bending-machine";


const getCategorySpeedInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
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
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return digitalEnhancementMachine(state);
        case ECategoryId.ENCAPSULATION_MACHINE:
            return encapsulationMachine(state);
        case ECategoryId.SIDE_COLORING:
            return sideColoringMachine(state);
        case ECategoryId.GUILLOTINE:
            return guillotineMachine(state);
        case ECategoryId.FLATBED_CUTTING_MACHINE:
            return flatbedCuttingMachine(state);
        case ECategoryId.ROLL_FED_CUTTING_PLOTTERS:
            return rollbedCuttingMachine(state);
        case ECategoryId.STAPLER_MACHINE:
            return staplerMachine(state);
        case ECategoryId.MANUAL_PEELING_STICKERS:
            return manualPeelingMachine(state);
        case ECategoryId.PIERCING_MACHINE:
            return piercingMachine(state);
        case ECategoryId.FRAMING_IN_FIXED_FRAMES:
            return framingFixedFrameMachine(state);
        case ECategoryId.CUSTOM_FRAMING:
            return customFrameMachine(state);
        case ECategoryId.LINKAGE:
            return linkageMachine(state);
        case ECategoryId.PVC_BENDING_MACHINE:
            return PVCBendingMachine(state);
        default:
            return [];
    }
}

export {getCategorySpeedInputs};