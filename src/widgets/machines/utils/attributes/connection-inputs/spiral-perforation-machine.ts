import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const spiralPerforationMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToSpiralClosing', ECategoryId.SPIRAL_CLOSING_MACHINE, 'connectToSpiralClosing'),

    ];
}

export {spiralPerforationMachine};