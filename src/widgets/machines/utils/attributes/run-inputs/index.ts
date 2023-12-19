import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {foldingMachine} from "@/widgets/machines/utils/attributes/run-inputs/folding-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/run-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/run-inputs/perforation-machine";
import {foldingGluingMachine} from "@/widgets/machines/utils/attributes/run-inputs/folding-gluing-machine";
import {bookletMachine} from "@/widgets/machines/utils/attributes/run-inputs/booklet-machine";

const getCategoryRunInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.FOLDING_MACHINE:
            return foldingMachine(state);
        case ECategoryId.SCORING_MACHINE:
            return scoringMachine(state);
        case ECategoryId.PERFORATION_MACHINE:
            return perforationMachine(state);
        case ECategoryId.FOLDING_GLUING_MACHINE:
            return foldingGluingMachine(state);
        case ECategoryId.BOOKLET_MACHINE:
            return bookletMachine(state);
        case ECategoryId.BOOKS_SEWING_MACHINE:
            return bookletMachine(state);
        case ECategoryId.BOOKS_BINDER_MACHINE:
            return bookletMachine(state);
        case ECategoryId.STAPLER_MACHINE:
            return bookletMachine(state);
        default:
            return []
    }
}

export {getCategoryRunInputs};