import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const bookCasingInMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToHardCoverMachine', ECategoryId.HARD_COVER_MAKING_MACHINE, 'connectToHardCoverMachine'),
        ...connectionToMachine(state, 'connectToPressing', ECategoryId.PRESSING_MACHINE, 'connectToPressing'),

    ];
}

export {bookCasingInMachine};