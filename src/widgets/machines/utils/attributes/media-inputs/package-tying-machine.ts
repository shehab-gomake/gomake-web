import {tyingOptions} from "@/widgets/machines/utils/const/tying-options";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const packageTyingMachine = (state: Record<string, any>) => {
    return [

        {
            name: "tyingOption",
            label: "machineAttributes.tyingOption",
            type: "select",
            placeholder: "machineAttributes.tyingOption",
            required: true,
            parameterKey: "tyingOption",
            value: state.attributes?.doubleHead,
            options: tyingOptions,
            machineInputType: 'input',
            isValid: true,
        },
        ...mediaDimensionsSettings(state),
        ...minMaxInput(state, 'mediaHeight', 'height')
    ]
}


export {packageTyingMachine};