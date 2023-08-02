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
import {adminActionsMaterialsStep} from "@/widgets/machines/utils/steps/admin-actions-materials-step";

const getSteps = (categoryId: ECategoryId, isAdmin: boolean): IStep[] => {
    let steps: IStep[];
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            steps = printingMachineSteps;
            break;
        case ECategoryId.OFSSET_PRINTING:
            steps = ofssetPrintingSteps;
            break;
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            steps = rollDigitalPrintingSteps;
            break;
        case ECategoryId.FLEXO_PRINTING:
            steps = flexoPrintingMachineSteps;
            break;
        case ECategoryId.ROLL_WIDE_PRINTING:
            steps = rollWidePrintingMachineSteps;
            break;
        case ECategoryId.FLATBED_WIDE_PRINTING:
            steps = flatbedWidePrintingMachineSteps;
            break;
        case ECategoryId.LAMINATION_MACHINE:
            steps = laminationMachineSteps;
            break;
        case ECategoryId.PUNCHING_MACHINE:
            steps = punchingMachineSteps;
            break;
        case ECategoryId.ROUNDING_CORNERS_MACHINE:
            steps = roundingCornersMachineSteps;
            break;
        case ECategoryId.FOLDING_MACHINE:
            steps = foldingMachineSteps(isAdmin);
            break;
        case ECategoryId.PASTING_BLOCKS_MACHINE:
            steps = pastingBlocksMachineSteps;
            break;
        case ECategoryId.SCORING_MACHINE:
            steps = scoringMachineSteps(isAdmin);
            break;
        case ECategoryId.PERFORATION_MACHINE:
            steps = perforationMachineSteps(isAdmin);
            break;
        case ECategoryId.FOLDING_GLUING_MACHINE:
            steps = foldingGluingMachineSteps;
            break;
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            steps = digitalEnhancementMachineSteps;
            break;
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            steps = analogEnhancementMachineSteps;
            break;
        case ECategoryId.ENCAPSULATION_MACHINE:
            steps = encapsulationMachineSteps;
            break;
        case ECategoryId.SIDE_COLORING:
            steps = sideColoringMachineSteps;
            break;
        case ECategoryId.GUILLOTINE:
            steps = guillottineMachineSteps;
            break;
        case ECategoryId.FLATBED_CUTTING_MACHINE:
            steps = flatbedCuttingMachineSteps;
            break;
        case ECategoryId.ROLL_FED_CUTTING_PLOTTERS:
            steps = rollFedCuttingMachineSteps;
            break;
        case ECategoryId.STAPLER_MACHINE:
            steps = staplerMachineSteps;
            break;
        case ECategoryId.MANUAL_PEELING_STICKERS:
            steps = manualPeelingStickersMachineSteps;
            break;
        case ECategoryId.MANUAL_SEWING_MACHINE:
            steps = manualSewingMachineSteps(isAdmin);
            break;
        case ECategoryId.PIERCING_MACHINE:
            steps = piercingMachineSteps;
            break;
        case ECategoryId.FRAMING_IN_FIXED_FRAMES:
            steps = framingInFixedFramesMachineSteps;
            break;
        case ECategoryId.CUSTOM_FRAMING:
            steps = customFramingMachineSteps;
            break;
        case ECategoryId.LINKAGE:
            steps = linkageMachineSteps;
            break;
        case ECategoryId.PVC_BENDING_MACHINE:
            steps = pvcBendingMachineSteps;
            break;
        case ECategoryId.COLLECTOR:
            steps = collectorMachineSteps(isAdmin);
            break;
        case ECategoryId.BOOKLET_MACHINE:
            steps = bookletMachineSteps(isAdmin);
            break;
        case ECategoryId.BOOKS_BINDER_MACHINE:
            steps = bookBinderMachineSteps(isAdmin);
            break;
        case ECategoryId.BOOKS_SEWING_MACHINE:
            steps = bookSewingMachineSteps(isAdmin);
            break;
        case ECategoryId.SPIRAL_CLOSING_MACHINE:
            steps = spiralClosingMachineSteps(isAdmin);
            break;
        case ECategoryId.SPIRAL_PERFORATION_MACHINE:
            steps = spiralPerforationMachineSteps(isAdmin);
            break;
        case ECategoryId.BOOK_CASING_IN_MACHINE:
            steps = bookCasingInMachineSteps(isAdmin);
            break;
        case ECategoryId.HARD_COVER_MAKING_MACHINE:
            steps = hardCoverMakingMachineSteps(isAdmin);
            break;
        case ECategoryId.GLUING_MACHINE:
            steps = gluingMachineSteps(isAdmin);
            break;
        case ECategoryId.PRESSING_MACHINE:
            steps = pressingMachineSteps(isAdmin);
            break;
        case ECategoryId.SHRINK_PACKING_MACHINE:
            steps = shrinkPackingMachineSteps;
            break;
        case ECategoryId.PACKAGE_TYING_MACHINE:
            steps = packageTyingMachineSteps;
            break;
        case ECategoryId.CARTOON_PACKAGING_MACHINE:
            steps = cartoonPackagingMachineSteps;
            break;
        case ECategoryId.ROLL_LASER_CUT_MACHINE:
            steps = rollLaserCutMachineSteps(isAdmin);
            break;
        case ECategoryId.ROLL_LAMINATION_MACHINE:
            steps = rollLaminationMachineSteps(isAdmin);
            break;
        case ECategoryId.ROLL_SHEET_MACHINE:
            steps = rollSheeterMachineSteps(isAdmin);
            break;
        case ECategoryId.ROLL_VARNISH_MACHINE:
            steps = rollVarnishMachineSteps(isAdmin);
            break;
        case ECategoryId.AUTO_BOOK_CUTTING_MACHINE:
            steps = autoBookMachineSteps;
            break;
        case ECategoryId.ROLL_DIE_CUT_MACHINE:
            steps = rollDieCutMachineSteps(isAdmin);
            break;
        case ECategoryId.ROLL_ANALOG_ENHANCEMENT_MACHINE:
            steps = rollAnalogEnhancementMachineSteps(isAdmin);
            break;
        case ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE:
            steps = rollDigitalEnhancementMachineSteps(isAdmin);
            break;
    }
    return isAdmin && steps ? [...steps, ...adminActionsMaterialsStep] : steps ? steps : []
}

export {getSteps};