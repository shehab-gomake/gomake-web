import {printingMachineSteps} from "@/widgets/machines/utils/steps/digital-printing-steps";
import {IStep} from "@/widgets/machines/utils/interface/step";
import {ofssetPrintingSteps} from "@/widgets/machines/utils/steps/ofsset-printing-steps";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {rollDigitalPrintingSteps} from "@/widgets/machines/utils/steps/roll-digital-printing-steps";
import {flexoPrintingMachineSteps} from "@/widgets/machines/utils/steps/flexo-printing-steps";
import {rollWidePrintingMachineSteps} from "@/widgets/machines/utils/steps/roll-wide-printing-steps";
import {flatbedWidePrintingMachineSteps} from "@/widgets/machines/utils/steps/flatbed-wide-printing-steps";
import {laminationMachineSteps} from "@/widgets/machines/utils/steps/lamination-machine-steps";
import {roundingCornersMachineSteps} from "@/widgets/machines/utils/steps/rounding-corners-machine-steps";
import {foldingMachineSteps} from "@/widgets/machines/utils/steps/folding-machine";
import {pastingBlocksMachineSteps} from "@/widgets/machines/utils/steps/pasting-blocks-machine";
import {scoringMachineSteps} from "@/widgets/machines/utils/steps/scoring-machine";
import {perforationMachineSteps} from "@/widgets/machines/utils/steps/perforation-machine";
import {foldingGluingMachineSteps} from "@/widgets/machines/utils/steps/folding-gluing-machine";
import {digitalEnhancementMachineSteps} from "@/widgets/machines/utils/steps/digital-enhancement-machine-steps";
import {punchingMachineSteps} from "@/widgets/machines/utils/steps/punching-machine-steps";
import {analogEnhancementMachineSteps} from "@/widgets/machines/utils/steps/analog-enhancement-machine-steps";
import {encapsulationMachineSteps} from "@/widgets/machines/utils/steps/encapsulation-machine-steps";
import {sideColoringMachineSteps} from "@/widgets/machines/utils/steps/side-coloring-machine-steps";
import {guillottineMachineSteps} from "@/widgets/machines/utils/steps/guillottine-machine-steps";
import {flatbedCuttingMachineSteps} from "@/widgets/machines/utils/steps/flatbed-cutting-machine-steps";
import {rollFedCuttingMachineSteps} from "@/widgets/machines/utils/steps/roll-fed-cutting-machine-steps";
import {staplerMachineSteps} from "@/widgets/machines/utils/steps/stapler-machine-steps";
import {manualPeelingStickersMachineSteps} from "@/widgets/machines/utils/steps/manual-peeling-stickers-machine-steps";
import {manualSewingMachineSteps} from "@/widgets/machines/utils/steps/manual-sewing-machine-steps";
import {piercingMachineSteps} from "@/widgets/machines/utils/steps/piercing-machine-steps";
import {framingInFixedFramesMachineSteps} from "@/widgets/machines/utils/steps/framing-in-fixed-frames-machine-steps";
import {customFramingMachineSteps} from "@/widgets/machines/utils/steps/custom-framing-machine-steps";
import {linkageMachineSteps} from "@/widgets/machines/utils/steps/linkage-machine-steps";
import {pvcBendingMachineSteps} from "@/widgets/machines/utils/steps/pvc-bending-machine-steps";
import {collectorMachineSteps} from "@/widgets/machines/utils/steps/collector-machine-steps";
import {bookletMachineSteps} from "@/widgets/machines/utils/steps/booklet-machine-steps";
import {bookBinderMachineSteps} from "@/widgets/machines/utils/steps/book-binder-machine-steps";
import {bookSewingMachineSteps} from "@/widgets/machines/utils/steps/book-sewing-machine-steps";
import {spiralClosingMachineSteps} from "@/widgets/machines/utils/steps/spiral-closing-machine-steps";
import {spiralPerforationMachineSteps} from "@/widgets/machines/utils/steps/spiral-perforation-machine-steps";
import {bookCasingInMachineSteps} from "@/widgets/machines/utils/steps/book-casing-in-machine-steps";
import {hardCoverMakingMachineSteps} from "@/widgets/machines/utils/steps/hard-cover-making-machine-steps";
import {gluingMachineSteps} from "@/widgets/machines/utils/steps/gluing-machine-steps";
import {pressingMachineSteps} from "@/widgets/machines/utils/steps/pressing-machine-steps";
import {shrinkPackingMachineSteps} from "@/widgets/machines/utils/steps/shrink-packing-machine-steps";
import {packageTyingMachineSteps} from "@/widgets/machines/utils/steps/package-tying-machine-steps";
import {cartoonPackagingMachineSteps} from "@/widgets/machines/utils/steps/cartoon-packaging-machine-steps";
import {rollLaserCutMachineSteps} from "@/widgets/machines/utils/steps/roll-laser-cut-machine-steps";
import {rollLaminationMachineSteps} from "@/widgets/machines/utils/steps/roll-lamination-machine-steps";
import {rollSheeterMachineSteps} from "@/widgets/machines/utils/steps/roll-sheeter-machine-steps";
import {rollVarnishMachineSteps} from "@/widgets/machines/utils/steps/roll-varnish-machine-steps";
import {autoBookMachineSteps} from "@/widgets/machines/utils/steps/auto-book-machine-steps";
import {rollDieCutMachineSteps} from "@/widgets/machines/utils/steps/roll-die-cut-machine-steps";
import {rollAnalogEnhancementMachineSteps} from "@/widgets/machines/utils/steps/roll-analog-enhancement-machine-steps";
import {
    rollDigitalEnhancementMachineSteps
} from "@/widgets/machines/utils/steps/roll-digital-enhancement-machine-steps";

const getSteps = (categoryId: ECategoryId, isAdmin: boolean): IStep[] => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return printingMachineSteps;
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrintingSteps;
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrintingSteps;
        case ECategoryId.FLEXO_PRINTING:
            return flexoPrintingMachineSteps;
        case ECategoryId.ROLL_WIDE_PRINTING:
            return rollWidePrintingMachineSteps;
        case ECategoryId.FLATBED_WIDE_PRINTING:
            return flatbedWidePrintingMachineSteps;
        case ECategoryId.LAMINATION_MACHINE:
            return laminationMachineSteps;
        case ECategoryId.PUNCHING_MACHINE:
            return punchingMachineSteps;
        case ECategoryId.ROUNDING_CORNERS_MACHINE:
            return roundingCornersMachineSteps;
        case ECategoryId.FOLDING_MACHINE:
            return foldingMachineSteps(isAdmin);
        case ECategoryId.PASTING_BLOCKS_MACHINE:
            return pastingBlocksMachineSteps;
        case ECategoryId.SCORING_MACHINE:
            return scoringMachineSteps(isAdmin);
        case ECategoryId.PERFORATION_MACHINE:
            return perforationMachineSteps(isAdmin);
        case ECategoryId.FOLDING_GLUING_MACHINE:
            return foldingGluingMachineSteps;
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return digitalEnhancementMachineSteps;
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return analogEnhancementMachineSteps;
        case ECategoryId.ENCAPSULATION_MACHINE:
            return encapsulationMachineSteps;
        case ECategoryId.SIDE_COLORING:
            return sideColoringMachineSteps;
        case ECategoryId.GUILLOTINE:
            return guillottineMachineSteps;
        case ECategoryId.FLATBED_CUTTING_MACHINE:
            return flatbedCuttingMachineSteps;
        case ECategoryId.ROLL_FED_CUTTING_PLOTTERS:
            return rollFedCuttingMachineSteps;
        case ECategoryId.STAPLER_MACHINE:
            return staplerMachineSteps;
        case ECategoryId.MANUAL_PEELING_STICKERS:
            return manualPeelingStickersMachineSteps;
        case ECategoryId.MANUAL_SEWING_MACHINE:
            return manualSewingMachineSteps(isAdmin);
        case ECategoryId.PIERCING_MACHINE:
            return piercingMachineSteps;
        case ECategoryId.FRAMING_IN_FIXED_FRAMES:
            return framingInFixedFramesMachineSteps;
        case ECategoryId.CUSTOM_FRAMING:
            return customFramingMachineSteps;
        case ECategoryId.LINKAGE:
            return linkageMachineSteps;
        case ECategoryId.PVC_BENDING_MACHINE:
            return pvcBendingMachineSteps;
        case ECategoryId.COLLECTOR:
            return collectorMachineSteps(isAdmin);
        case ECategoryId.BOOKLET_MACHINE:
            return bookletMachineSteps(isAdmin);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return bookBinderMachineSteps(isAdmin);
        case ECategoryId.BOOKS_SEWING_MACHINE:
            return bookSewingMachineSteps(isAdmin);
        case ECategoryId.SPIRAL_CLOSING_MACHINE:
            return spiralClosingMachineSteps(isAdmin);
        case ECategoryId.SPIRAL_PERFORATION_MACHINE:
            return spiralPerforationMachineSteps(isAdmin);
        case ECategoryId.BOOK_CASING_IN_MACHINE:
            return bookCasingInMachineSteps(isAdmin);
        case ECategoryId.HARD_COVER_MAKING_MACHINE:
            return hardCoverMakingMachineSteps(isAdmin);
        case ECategoryId.GLUING_MACHINE:
            return gluingMachineSteps(isAdmin);
        case ECategoryId.PRESSING_MACHINE:
            return pressingMachineSteps(isAdmin);
        case ECategoryId.SHRINK_PACKING_MACHINE:
            return shrinkPackingMachineSteps;
        case ECategoryId.PACKAGE_TYING_MACHINE:
            return packageTyingMachineSteps;
        case ECategoryId.CARTOON_PACKAGING_MACHINE:
            return cartoonPackagingMachineSteps;
        case ECategoryId.ROLL_LASER_CUT_MACHINE:
            return rollLaserCutMachineSteps(isAdmin);
        case ECategoryId.ROLL_LAMINATION_MACHINE:
            return rollLaminationMachineSteps(isAdmin);
        case ECategoryId.ROLL_SHEET_MACHINE:
            return rollSheeterMachineSteps(isAdmin);
        case ECategoryId.ROLL_VARNISH_MACHINE:
            return rollVarnishMachineSteps(isAdmin);
        case ECategoryId.AUTO_BOOK_CUTTING_MACHINE:
            return autoBookMachineSteps;
        case ECategoryId.ROLL_DIE_CUT_MACHINE:
            return rollDieCutMachineSteps(isAdmin);
        case ECategoryId.ROLL_ANALOG_ENHANCEMENT_MACHINE:
            return rollAnalogEnhancementMachineSteps(isAdmin);
        case ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE:
            return rollDigitalEnhancementMachineSteps(isAdmin);
        default:
            return []
    }
}

export {getSteps};