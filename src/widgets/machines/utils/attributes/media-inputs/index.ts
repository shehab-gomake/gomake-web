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
import {foldingMachine} from "@/widgets/machines/utils/attributes/media-inputs/folding-machine";
import {pastingBlocksMachine} from "@/widgets/machines/utils/attributes/media-inputs/pasting-blocks-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/media-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/media-inputs/perforation-machine";
import {foldingGluingMachine} from "@/widgets/machines/utils/attributes/media-inputs/folding-gluing-machine";
import {digitalEnhancementMachine} from "@/widgets/machines/utils/attributes/media-inputs/digital-enhancement-machine";
import {encapsulationMachine} from "@/widgets/machines/utils/attributes/media-inputs/encapsulation-machine";
import {sideColoringMachine} from "@/widgets/machines/utils/attributes/media-inputs/side-coloring-machine";
import {guillotineMachine} from "@/widgets/machines/utils/attributes/media-inputs/guillotine-machine";
import {flatbedCuttingMachine} from "@/widgets/machines/utils/attributes/media-inputs/flatbed-cutting-machine";
import {rollbedCuttingMachine} from "@/widgets/machines/utils/attributes/media-inputs/rollbed-cutting-machine";
import {staplerMachine} from "@/widgets/machines/utils/attributes/media-inputs/stapler-machine";
import {piercingMachine} from "@/widgets/machines/utils/attributes/media-inputs/piercing-machine";
import {framingFixedFrameMachine} from "@/widgets/machines/utils/attributes/media-inputs/framing-fixed-frame-machine";
import {customFrameMachine} from "@/widgets/machines/utils/attributes/media-inputs/custom-frame-machine";
import {linkageMachine} from "@/widgets/machines/utils/attributes/media-inputs/linkage-machine";
import {PVCBendingMachine} from "@/widgets/machines/utils/attributes/media-inputs/PVC-bending-machine";
import {collectorMachine} from "@/widgets/machines/utils/attributes/media-inputs/collector-machine";
import {bookletMachine} from "@/widgets/machines/utils/attributes/media-inputs/booklet-machine";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/media-inputs/book-binder-machine";
import {bookSewingMachine} from "@/widgets/machines/utils/attributes/media-inputs/book-sewing-machine";
import {spiralClosingMachine} from "@/widgets/machines/utils/attributes/media-inputs/spiral-closing-machine";
import {spiralPerforationMachine} from "@/widgets/machines/utils/attributes/media-inputs/spiral-perforation-machine";
import {bookCasingInMachine} from "@/widgets/machines/utils/attributes/media-inputs/book-casing-in-machine";
import {hardCoverMakingMachine} from "@/widgets/machines/utils/attributes/media-inputs/hard-cover-making-machine";
import {gluingMachine} from "@/widgets/machines/utils/attributes/media-inputs/gluing-machine";
import {pressingMachine} from "@/widgets/machines/utils/attributes/media-inputs/pressing-machine";
import {manualSewingMachine} from "@/widgets/machines/utils/attributes/media-inputs/manual-sewing-machine";
import {shrinkPackingMachine} from "@/widgets/machines/utils/attributes/media-inputs/shrink-packing-machine";
import {packageTyingMachine} from "@/widgets/machines/utils/attributes/media-inputs/package-tying-machine";
import {cartoonPackagingMachine} from "@/widgets/machines/utils/attributes/media-inputs/cartoon-packaging-machine";
import {rollLaserCutMachine} from "@/widgets/machines/utils/attributes/media-inputs/roll-laser-cut-machine";
import {autoBookCuttingMachine} from "@/widgets/machines/utils/attributes/media-inputs/auto-book-cutting-machine";

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
        case ECategoryId.COLLECTOR:
            return collectorMachine(state);
        case ECategoryId.BOOKLET_MACHINE:
            return bookletMachine(state);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return bookBinderMachine(state);
        case ECategoryId.BOOKS_SEWING_MACHINE:
            return bookSewingMachine(state);
        case ECategoryId.SPIRAL_CLOSING_MACHINE:
            return spiralClosingMachine(state);
        case ECategoryId.SPIRAL_PERFORATION_MACHINE:
            return spiralPerforationMachine(state);
        case ECategoryId.BOOK_CASING_IN_MACHINE:
            return bookCasingInMachine(state);
        case ECategoryId.HARD_COVER_MAKING_MACHINE:
            return hardCoverMakingMachine(state);
        case ECategoryId.GLUING_MACHINE:
            return gluingMachine(state);
        case ECategoryId.PRESSING_MACHINE:
            return pressingMachine(state);
        case ECategoryId.MANUAL_SEWING_MACHINE:
            return manualSewingMachine(state);
        case ECategoryId.SHRINK_PACKING_MACHINE:
            return shrinkPackingMachine(state);
        case ECategoryId.PACKAGE_TYING_MACHINE:
            return packageTyingMachine(state);
        case ECategoryId.CARTOON_PACKAGING_MACHINE:
            return cartoonPackagingMachine(state);
        case ECategoryId.ROLL_LASER_CUT_MACHINE:
            return rollLaserCutMachine(state);
        case ECategoryId.ROLL_LAMINATION_MACHINE:
            return rollLaserCutMachine(state);
        case ECategoryId.ROLL_SHEET_MACHINE:
            return rollLaserCutMachine(state);
        case ECategoryId.ROLL_VARNISH_MACHINE:
            return rollLaserCutMachine(state);
        case ECategoryId.AUTO_BOOK_CUTTING_MACHINE:
            return autoBookCuttingMachine(state);
        case ECategoryId.ROLL_DIE_CUT_MACHINE:
            return rollLaserCutMachine(state);
        case ECategoryId.ROLL_ANALOG_ENHANCEMENT_MACHINE:
            return rollLaserCutMachine(state);
        case ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE:
            return rollLaserCutMachine(state);
        default:
            return []
    }
}

export {getCategoryMediaInputs};