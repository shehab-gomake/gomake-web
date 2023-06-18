import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {foldingMachine} from "@/widgets/machines/utils/attributes/connection-inputs/folding-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/connection-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/connection-inputs/perforation-machine";


const getCategoryConnectionInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.FOLDING_MACHINE:
            return foldingMachine(state);
        case ECategoryId.SCORING_MACHINE:
            return scoringMachine(state);
        case ECategoryId.PERFORATION_MACHINE:
            return perforationMachine(state);
        default:
            return []
    }
}

export {getCategoryConnectionInputs};