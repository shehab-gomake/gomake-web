import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {bookletMachine} from "@/widgets/machines/utils/attributes/other-settings/booklet-machine";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/other-settings/book-binder-machine";
import {spiralClosingMachine} from "@/widgets/machines/utils/attributes/other-settings/spiral-closing-machine";
import {spiralPerforationMachine} from "@/widgets/machines/utils/attributes/other-settings/spiral-perforation-machine";
import {rollLaminationMachine} from "@/widgets/machines/utils/attributes/other-settings/roll-lamination-machine";
import {rollVarnishMachine} from "@/widgets/machines/utils/attributes/other-settings/roll-varnish-machine";
import {rollDieCutMachine} from "@/widgets/machines/utils/attributes/other-settings/roll-die-cut-machine";


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
        default:
            return []
    }
}

export {getCategoryInputs};