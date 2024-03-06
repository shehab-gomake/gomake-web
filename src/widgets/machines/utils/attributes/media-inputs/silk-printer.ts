import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const silkPrinter = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),
        ...minMaxInput(state, 'plateGauge', 'plateGauge'),
    ]
}


export {silkPrinter};