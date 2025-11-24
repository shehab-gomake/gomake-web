import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {bookletMachine} from "@/widgets/machines/utils/attributes/other-settings/booklet-machine";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/other-settings/book-binder-machine";
import {spiralClosingMachine} from "@/widgets/machines/utils/attributes/other-settings/spiral-closing-machine";
import {spiralPerforationMachine} from "@/widgets/machines/utils/attributes/other-settings/spiral-perforation-machine";
import {rollLaminationMachine} from "@/widgets/machines/utils/attributes/other-settings/roll-lamination-machine";
import {rollVarnishMachine} from "@/widgets/machines/utils/attributes/other-settings/roll-varnish-machine";
import {rollDieCutMachine} from "@/widgets/machines/utils/attributes/other-settings/roll-die-cut-machine";
import {rollLaserCutMachine} from "@/widgets/machines/utils/attributes/other-settings/roll-laser-cut-machine";
import {analogEnhancementMachine} from "@/widgets/machines/utils/attributes/other-settings/analog-enhancement-machine";
import {collectorMachine} from "@/widgets/machines/utils/attributes/other-settings/collector-machine";
import {widePrinting} from "@/widgets/machines/utils/attributes/other-settings/wide-printing";
import {laminationMachine} from "@/widgets/machines/utils/attributes/other-settings/lamination-machine";
import {cartoonCupsMachine} from "@/widgets/machines/utils/attributes/other-settings/cartoon-cups-machine";
import {cncMachine} from "@/widgets/machines/utils/attributes/other-settings/cnc-machine";
import {
    applicationCategories
} from "@/widgets/machines/utils/attributes/machine-material-categories/application-categories";
import {lightBoxesMachine} from "@/widgets/machines/utils/attributes/other-settings/light-boxes-machine";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/other-settings/digital-printing";


const getCategoryInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.BOOKLET_MACHINE:
            return bookletMachine(state);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return bookBinderMachine(state);
        case ECategoryId.SPIRAL_CLOSING_MACHINE:
            return spiralClosingMachine(state);
        case ECategoryId.SPIRAL_PERFORATION_MACHINE:
            return spiralPerforationMachine(state);
        case ECategoryId.ROLL_LAMINATION_MACHINE:
            return rollLaminationMachine(state);
        case ECategoryId.ROLL_VARNISH_MACHINE:
            return rollVarnishMachine(state);
        case ECategoryId.ROLL_DIE_CUT_MACHINE:
            return rollDieCutMachine(state);
        case ECategoryId.ROLL_FINISH_MACHINE:
            return rollLaserCutMachine(state);
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return analogEnhancementMachine(state);
        case ECategoryId.JOINTING_MACHINES:
            return [];
        case ECategoryId.COLLECTOR:
            return collectorMachine(state);
        case ECategoryId.BOOKS_SEWING_MACHINE:
            return bookletMachine(state);
        case ECategoryId.ROLL_WIDE_PRINTING:
            return widePrinting(state);
        case ECategoryId.LAMINATION_MACHINE:
            return laminationMachine(state);
        case ECategoryId.CARTOON_CUPS:
            return cartoonCupsMachine(state);
        case ECategoryId.FLATBED_CUTTING_MACHINE:
            return cncMachine(state);
        case ECategoryId.SUBLIMATION:
            return applicationCategories(state);
        case ECategoryId.LIGHT_BOXES_LETTER_ASSEMBLY:
            return lightBoxesMachine(state);
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        default:
            return []
    }
}

export {getCategoryInputs};