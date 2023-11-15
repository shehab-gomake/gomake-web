import {ofssetPrinting} from "@/widgets/machines/utils/attributes/feeders-stackers-inputs/ofsset-printing";

const enhancementMachine = (state: Record<string, any>) => {
    return [
        ...ofssetPrinting(state)
    ]
};

export {enhancementMachine};