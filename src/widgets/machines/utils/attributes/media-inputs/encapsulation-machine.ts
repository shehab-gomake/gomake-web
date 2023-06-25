import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";

const encapsulationMachine = (state: Record<string, any>) => {
    return [
        {
            name: "minMarginLamination",
            label: "machineAttributes.minMarginLamination",
            type: "text",
            placeholder: "machineAttributes.minMarginLamination",
            required: true,
            parameterKey: "minMarginLamination",
            options: [],
            value: state?.attributes?.minMarginLamination ? state?.attributes?.minMarginLamination : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.minMarginLamination,
        },
        ...mediaDimensionsSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state)
    ]
}


export {encapsulationMachine};