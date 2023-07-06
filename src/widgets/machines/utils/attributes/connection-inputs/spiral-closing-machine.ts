import {connectionToMachine} from "@/widgets/machines/utils/attributes/connection-inputs/connection-to-machine";
import {ECategoryId} from "@/widgets/machines/enums/category-id";

const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        ...connectionToMachine(state, 'connectToSpiralPerforation', ECategoryId.SPIRAL_PERFORATION_MACHINE, 'connectToSpiralPerforation'),

    ];
}

export {spiralClosingMachine};