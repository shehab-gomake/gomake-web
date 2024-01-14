import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const foldingGluingMachine = (state: Record<string, any>) => {
    return [
        ...mediaSheetLossInput(state),
        ...mediaDimensionsSettings(state),

        {
            name: 'machineAttributes.mediaASize',
            parameterKey: 'mediaASize',
            machineInputType: 'multiInput',
            value: state?.attributes?.mediaASize,
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
                    value: state.attributes?.mediaASize?.min ? state.attributes?.mediaASize?.min : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaASize?.max ? state.attributes?.mediaASize?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.mediaBSize',
            parameterKey: 'mediaBSize',
            machineInputType: 'multiInput',
            value: state?.attributes?.mediaBSize,
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
                    value: state.attributes?.mediaBSize?.min ? state.attributes?.mediaBSize?.min : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaBSize?.max ? state.attributes?.mediaBSize?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.mediaCSize',
            parameterKey: 'mediaCSize',
            machineInputType: 'multiInput',
            value: state?.attributes?.mediaCSize,
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
                    value: state.attributes?.mediaCSize?.min ? state.attributes?.mediaCSize?.min : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaCSize?.max ? state.attributes?.mediaCSize?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.mediaDSize',
            parameterKey: 'mediaDSize',
            machineInputType: 'multiInput',
            value: state?.attributes?.mediaDSize,
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
                    value: state.attributes?.mediaDSize?.min ? state.attributes?.mediaDSize?.min : '',
                    unit: EMeasurementUnits.CM

                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaDSize?.max ? state.attributes?.mediaDSize?.max : '',
                    unit: EMeasurementUnits.CM

                },
            ]
        },
    ]
}


export {foldingGluingMachine};