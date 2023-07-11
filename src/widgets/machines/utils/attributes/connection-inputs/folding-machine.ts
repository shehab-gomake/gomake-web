import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const foldingMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToScoring', ECategoryId.SCORING_MACHINE, 'connectToScoring'),
        ...connectionToMachine(state, 'connectToPerforation', ECategoryId.PERFORATION_MACHINE, 'connectToPerforation'),
    ];
}

export {foldingMachine};