import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const hardCoverMakingMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToBookCasing', ECategoryId.BOOK_CASING_IN_MACHINE, 'connectToBookCasing'),

    ];
}

export {hardCoverMakingMachine};