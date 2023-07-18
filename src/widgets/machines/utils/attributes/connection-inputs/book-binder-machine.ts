import {
    connectionToPrintingMachine
} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-printing-machine";
import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const bookBinderMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToCollectorMachine', ECategoryId.COLLECTOR, 'connectToCollectorMachine'),
        ...connectionToPrintingMachine(state)
    ];
}

export {bookBinderMachine};