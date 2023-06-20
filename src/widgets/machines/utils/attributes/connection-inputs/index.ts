import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {foldingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/folding-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/connection-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/connection-inputs/perforation-machine";
import {collectorMachine} from "@/widgets/machines/utils/attributes/connection-inputs/collector-machine";
import {bookletMachine} from "@/widgets/machines/utils/attributes/connection-inputs/booklet-machine";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/connection-inputs/book-binder-machine";
import {bookSewingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/book-sewing-machine";
import {spiralClosingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/spiral-closing-machine";


const getCategoryConnectionInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.FOLDING_MACHINE:
            return foldingMachine(state);
        case ECategoryId.SCORING_MACHINE:
            return scoringMachine(state);
        case ECategoryId.PERFORATION_MACHINE:
            return perforationMachine(state);
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
        default:
            return []
    }
}

export {getCategoryConnectionInputs};