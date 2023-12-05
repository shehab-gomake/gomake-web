import {
    connectionToPrintingMachine
} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-printing-machine";
import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const bookletMachine = (state: Record<string, any>) => {
    return [
        ...connectionToPrintingMachine(state),
        ...connectionToMachine(state, 'connectToCollector', ECategoryId.COLLECTOR, 'connectToCollector')
     ];
}

export {bookletMachine};