import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const cncMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToWideFormatMachine', ECategoryId.FOLDING_MACHINE, 'connectToWideFormatMachine'),

    ];
}

export {cncMachine};