import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/beats-inputs/digital-printing";
import {digitalEnhancementMachine} from "@/widgets/machines/utils/attributes/beats-inputs/digital-enhancement-machine";
import {shrinkPackingMachine} from "@/widgets/machines/utils/attributes/beats-inputs/shrink-packing-machine";
import {packageTyingMachine} from "@/widgets/machines/utils/attributes/beats-inputs/package-tying-machine";
import {cartoonPackagingMachine} from "@/widgets/machines/utils/attributes/beats-inputs/cartoon-packaging-machinets";
import {rollDieCutMachine} from "@/widgets/machines/utils/attributes/beats-inputs/roll-die-cut-machine";

const getCategoryBeatsInputs = (categoryId: string, state: Record<string, any>, printColors?: {value: string, text: string}[]) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state, printColors);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return digitalPrinting(state, printColors);
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return digitalEnhancementMachine(state);
        case ECategoryId.SHRINK_PACKING_MACHINE:
            return shrinkPackingMachine(state);
        case ECategoryId.PACKAGE_TYING_MACHINE:
            return packageTyingMachine(state);
        case ECategoryId.CARTOON_PACKAGING_MACHINE:
            return cartoonPackagingMachine(state);
        case ECategoryId.ROLL_DIE_CUT_MACHINE:
            return rollDieCutMachine(state);
        default:
            return [];
    }
}

export {getCategoryBeatsInputs};