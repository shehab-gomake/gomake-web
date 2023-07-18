import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const perforationMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToPerforation', ECategoryId.PERFORATION_MACHINE, 'connectToPerforation'),
        ...connectionToMachine(state, 'connectToScoring', ECategoryId.SCORING_MACHINE, 'connectToScoring'),

    ];
}

export {perforationMachine};