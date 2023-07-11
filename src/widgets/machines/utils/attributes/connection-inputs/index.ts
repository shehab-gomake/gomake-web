import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {foldingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/folding-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/connection-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/connection-inputs/perforation-machine";
import {collectorMachine} from "@/widgets/machines/utils/attributes/connection-inputs/collector-machine";
import {bookletMachine} from "@/widgets/machines/utils/attributes/connection-inputs/booklet-machine";
import {bookBinderMachine} from "@/widgets/machines/utils/attributes/connection-inputs/book-binder-machine";
import {bookSewingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/book-sewing-machine";
import {spiralClosingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/spiral-closing-machine";
import {spiralPerforationMachine} from "@/widgets/machines/utils/attributes/connection-inputs/spiral-perforation-machine";
import {bookCasingInMachine} from "@/widgets/machines/utils/attributes/connection-inputs/book-casing-in-machine";
import {hardCoverMakingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/hard-cover-making-machine";
import {gluingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/gluing-machine";
import {pressingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/pressing-machine";
import {manualSewingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/manual=sewing-machine";
import {rollMachinesConnection} from "@/widgets/machines/utils/attributes/connection-inputs/roll-machines-connection";


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
        case ECategoryId.ROLL_LASER_CUT_MACHINE:
            return rollMachinesConnection(state);
        default:
            return rollMachinesConnection(state)
    }
}

export {getCategoryConnectionInputs};