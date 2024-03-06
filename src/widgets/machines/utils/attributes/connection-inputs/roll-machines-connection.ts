import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const rollMachinesConnection = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToPrinter', ECategoryId.DIGITAL_PRINTING, 'connectToPrinter'),
        ...connectionToMachine(state, 'connectToFlexo', ECategoryId.FLEXO_PRINTING, 'connectToFlexoPrinter'),
    ];
}

export {rollMachinesConnection};