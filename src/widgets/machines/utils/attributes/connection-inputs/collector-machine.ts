import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const collectorMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToBooklet', ECategoryId.BOOKLET_MACHINE, 'connectToBooklet'),
        ...connectionToMachine(state, 'connectToBooksBinder', ECategoryId.BOOKS_BINDER_MACHINE, 'connectToBooksBinder'),
        ...connectionToMachine(state, 'connectToBookSewing', ECategoryId.BOOKS_SEWING_MACHINE, 'connectToBookSewing'),
    ];
}

export {collectorMachine};