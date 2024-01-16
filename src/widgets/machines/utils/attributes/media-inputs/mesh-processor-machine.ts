import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";

const meshProcessorMachine = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),
        {
            name: "screenAmount",
            label: "machineAttributes.screenAmount",
            type: "text",
            placeholder: "machineAttributes.screenAmount",
            required: true,
            parameterKey: "screenAmount",
            options: [],
            value: state?.attributes?.screenAmount ? state?.attributes?.screenAmount : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.screenAmount,
        },
    ]
}


export {meshProcessorMachine};