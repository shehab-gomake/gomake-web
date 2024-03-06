import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const encapsulationMachine = (state: Record<string, any>) => {
    return [
        {
            name: "minMarginWithoutPrinting",
            label: "machineAttributes.minMarginWithoutPrinting",
            type: "text",
            placeholder: "machineAttributes.minMarginWithoutPrinting",
            required: true,
            parameterKey: "minMarginWithoutPrinting",
            options: [],
            value: state?.attributes?.minMarginWithoutPrinting ? state?.attributes?.minMarginWithoutPrinting : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.minMarginWithoutPrinting,
            unit: EMeasurementUnits.MM
        },
        ...mediaDimensionsSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state,EMeasurementUnits.UM)
    ]
}


export {encapsulationMachine};