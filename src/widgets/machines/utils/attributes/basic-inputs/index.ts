import {digitalPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/digital-printing";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/ofsset-printing";
import {rolldDigitalPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/basic-inputs/flexo-printing";
import {rollWidePrinting} from "@/widgets/machines/utils/attributes/basic-inputs/roll-wide-printing";
import {flatbedWidePrinting} from "@/widgets/machines/utils/attributes/basic-inputs/flatbed-wide-printing";
import {laminationMachine} from "@/widgets/machines/utils/attributes/basic-inputs/lamination-machine";
import {punchingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/punching-machine";
import {roundingCornersMachine} from "@/widgets/machines/utils/attributes/basic-inputs/rounding-corners-machine";
import {foldingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/folding-machine";
import {pastingBlocksMachine} from "@/widgets/machines/utils/attributes/basic-inputs/pasting-blocks-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/basic-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/basic-inputs/perforation-machine";
import {foldingGluingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/folding-gluing-machine";
import {digitalEnhancementMachine} from "@/widgets/machines/utils/attributes/basic-inputs/digital-enhancement-machine";
import {analogEnhancementMachine} from "@/widgets/machines/utils/attributes/basic-inputs/analog-enhancement-machine";
import {encapsulationMachine} from "@/widgets/machines/utils/attributes/basic-inputs/encapsulation-machine";
import {sideColoringMachine} from "@/widgets/machines/utils/attributes/basic-inputs/side-coloring-machine";
import {guillotineMachine} from "@/widgets/machines/utils/attributes/basic-inputs/guillotine-machine";
import {flatbedCuttingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/flatbed-cutting-machine";
import {rollfedCuttingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/rollfed-cutting-machine";
import {staplerMachine} from "@/widgets/machines/utils/attributes/basic-inputs/stapler-machine";
import {manualPeelingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/manual-peeling-machine";
import {piercingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/piercing-machine";
import {framingFixedFrameMachine} from "@/widgets/machines/utils/attributes/basic-inputs/framing-fixed-frame-machine";
import {customFrameMachine} from "@/widgets/machines/utils/attributes/basic-inputs/custom-frame-machine";
import {linkageMachine} from "@/widgets/machines/utils/attributes/basic-inputs/linkage-machine";
import {PVCBendingMachine} from "@/widgets/machines/utils/attributes/basic-inputs/PVC-bending-machine";

const getCategoryBasicInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rolldDigitalPrinting(state);
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
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return analogEnhancementMachine(state);
        case ECategoryId.ENCAPSULATION_MACHINE:
            return encapsulationMachine(state);
        case ECategoryId.SIDE_COLORING:
            return sideColoringMachine(state);
        case ECategoryId.GUILLOTINE:
            return guillotineMachine(state);
        case ECategoryId.FLATBED_CUTTING_MACHINE:
            return flatbedCuttingMachine(state);
        case ECategoryId.ROLL_FED_CUTTING_PLOTTERS:
            return rollfedCuttingMachine(state);
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
            return []
    }
}

export {getCategoryBasicInputs};