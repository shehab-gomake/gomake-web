import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const linkageMachine = (state: Record<string, any>) => {
    return [
        {
            name: "mediaLossMeter",
            label: "machineAttributes.mediaLossMeter",
            type: "text",
            placeholder: "machineAttributes.mediaLossMeter",
            required: true,
            parameterKey: "mediaLossMeter",
            value: state?.attributes?.mediaLossMeter,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaLossMeter,
            unit: EMeasurementUnits.METER
        },
        {
            name: 'machineAttributes.rolls',
            parameterKey: 'rolls',
            machineInputType: 'multiInput',
            value: state?.attributes?.rolls,
            isValid: !!state?.attributes?.rolls?.maxWidth &&
                !!state?.attributes?.rolls?.maxLength &&
                !!state?.attributes?.rolls?.maxThickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.rolls?.maxWidth ? state.attributes?.rolls?.maxWidth : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.rolls?.maxLength ? state.attributes?.rolls?.maxLength : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: [],
                    value: state.attributes?.rolls?.maxThickness ? state.attributes?.rolls?.maxThickness : '',
                    unit: EMeasurementUnits.MM
                },
            ]
        },
        {
            name: 'machineAttributes.flatbeds',
            parameterKey: 'flatbeds',
            machineInputType: 'multiInput',
            value: state?.attributes?.flatbeds,
            isValid: !!state?.attributes?.flatbeds?.maxWidth &&
                !!state?.attributes?.flatbeds?.maxLength &&
                !!state?.attributes?.flatbeds?.maxThickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.flatbeds?.maxWidth ? state.attributes?.flatbeds?.maxWidth : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.flatbeds?.maxLength ? state.attributes?.flatbeds?.maxLength : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: [],
                    value: state.attributes?.flatbeds?.maxThickness ? state.attributes?.flatbeds?.maxThickness : '',
                    unit: EMeasurementUnits.MM
                },
            ]
        },
    ]
}


export {linkageMachine};