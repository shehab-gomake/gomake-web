import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const pressingMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToCaseIn', ECategoryId.BOOK_CASING_IN_MACHINE, 'connectToCaseIn'),
    ];
}

export {pressingMachine};