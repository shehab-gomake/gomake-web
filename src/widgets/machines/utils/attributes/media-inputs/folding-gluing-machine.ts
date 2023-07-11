import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";

const foldingGluingMachine = (state: Record<string, any>) => {
    return [
        ...mediaSheetLossInput(state),
        ...mediaDimensionsSettings(state),

        {
            name: 'machineAttributes.mediaASize',
            parameterKey: 'mediaASize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaASize?.min &&
                !!state?.attributes?.mediaASize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaASize?.min ? state.attributes?.mediaASize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaASize?.max ? state.attributes?.mediaASize?.max : ''

                },
            ]
        },
        {
            name: 'machineAttributes.mediaBSize',
            parameterKey: 'mediaBSize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaBSize?.min &&
                !!state?.attributes?.mediaBSize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaBSize?.min ? state.attributes?.mediaBSize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaBSize?.max ? state.attributes?.mediaBSize?.max : ''

                },
            ]
        },
        {
            name: 'machineAttributes.mediaCSize',
            parameterKey: 'mediaCSize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaCSize?.min &&
                !!state?.attributes?.mediaCSize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaCSize?.min ? state.attributes?.mediaCSize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaCSize?.max ? state.attributes?.mediaCSize?.max : ''

                },
            ]
        },
        {
            name: 'machineAttributes.mediaDSize',
            parameterKey: 'mediaDSize',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaDSize?.min &&
                !!state?.attributes?.mediaDSize?.max,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaDSize?.min ? state.attributes?.mediaDSize?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaDSize?.max ? state.attributes?.mediaDSize?.max : ''

                },
            ]
        },
    ]
}


export {foldingGluingMachine};