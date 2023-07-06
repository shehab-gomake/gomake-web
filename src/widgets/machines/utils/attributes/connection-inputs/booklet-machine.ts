import {
    connectionToPrintingMachine
} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-printing-machine";

const bookletMachine = (state: Record<string, any>) => {
    return [
        ...connectionToPrintingMachine(state)
     ];
}

export {bookletMachine};