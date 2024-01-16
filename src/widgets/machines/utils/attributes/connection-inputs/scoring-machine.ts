import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const scoringMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToFolding', ECategoryId.FOLDING_MACHINE, 'connectToFolding'),
    ];
}

export {scoringMachine};