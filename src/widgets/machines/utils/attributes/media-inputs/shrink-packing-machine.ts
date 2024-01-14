import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const shrinkPackingMachine = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),
        ...minMaxInput(state, 'mediaHeight', 'height', EMeasurementUnits.CM),
    ]
}


export {shrinkPackingMachine};