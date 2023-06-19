import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {foldingMachine} from "@/widgets/machines/utils/attributes/run-inputs/folding-machine";
import {scoringMachine} from "@/widgets/machines/utils/attributes/run-inputs/scoring-machine";
import {perforationMachine} from "@/widgets/machines/utils/attributes/run-inputs/perforation-machine";
import {foldingGluingMachine} from "@/widgets/machines/utils/attributes/run-inputs/folding-gluing-machine";

const getCategoryFoldingInputs = (categoryId: string, state: Record<string, any>): any[] => {
    switch (categoryId) {
        case ECategoryId.FOLDING_MACHINE:
            return foldingMachine(state);
        case ECategoryId.SCORING_MACHINE:
            return scoringMachine(state);
        case ECategoryId.PERFORATION_MACHINE:
            return perforationMachine(state);
        case ECategoryId.FOLDING_GLUING_MACHINE:
            return foldingGluingMachine(state);
        default:
            return []
    }
}

export {getCategoryFoldingInputs};