import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {digitalPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/digital-printing";
import {ofssetPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/ofsset-printing";
import {rollDigitalPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/roll-digital-printing";
import {flexoPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/flexo-printing";
import {rollWidePrinting} from "@/widgets/machines/utils/attributes/colors-inputs/roll-wide-printing";
import {flatbedWidePrinting} from "@/widgets/machines/utils/attributes/colors-inputs/flatbed-wide-printing";
import {pastingBlocksMachine} from "@/widgets/machines/utils/attributes/colors-inputs/pasting-blocks-machine";
import {enhancementMachine} from "@/widgets/machines/utils/attributes/colors-inputs/enhancement-machine";
import {sideColoringMachine} from "@/widgets/machines/utils/attributes/colors-inputs/side-coloring-machine";


const getCategoryColorsInputs = (categoryId: string, state: Record<string, any>) => {
    switch (categoryId) {
        case ECategoryId.DIGITAL_PRINTING:
            return digitalPrinting(state);
        case ECategoryId.OFSSET_PRINTING:
            return ofssetPrinting(state);
        case ECategoryId.ROLL_DIGITAL_PRINTING:
            return rollDigitalPrinting(state);
        case ECategoryId.FLEXO_PRINTING:
            return flexoPrinting(state);
        case ECategoryId.ROLL_WIDE_PRINTING:
            return rollWidePrinting(state);
        case ECategoryId.FLATBED_WIDE_PRINTING:
            return flatbedWidePrinting(state);
        case ECategoryId.PASTING_BLOCKS_MACHINE:
            return pastingBlocksMachine(state);
        case ECategoryId.DIGITAL_ENHANCEMENT_MACHINE:
            return enhancementMachine(state);
        case ECategoryId.ANALOG_ENHANCEMENT_MACHINE:
            return enhancementMachine(state);
        case ECategoryId.SIDE_COLORING:
            return sideColoringMachine(state);
        case ECategoryId.ROLL_ANALOG_ENHANCEMENT_MACHINE:
            return enhancementMachine(state);
        case ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE:
            return enhancementMachine(state);
        default:
            return []
    }
}

export {getCategoryColorsInputs};