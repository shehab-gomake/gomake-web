import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const autoBookCuttingMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.bookThickness',
            parameterKey: 'bookThickness',
            machineInputType: 'multiInput',
            value: state?.attributes?.bookThickness,
            isValid: !!state?.attributes?.bookThickness?.min &&
                !!state?.attributes?.bookThickness?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.bookThickness?.min ? state.attributes?.bookThickness?.min : '',
                    unit: EMeasurementUnits.MM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.bookThickness?.max ? state.attributes?.bookThickness?.max : '',
                    unit: EMeasurementUnits.MM
                },
            ]
        },
        {
            name: 'machineAttributes.bookHeight',
            parameterKey: 'bookHeight',
            machineInputType: 'multiInput',
            value: state?.attributes?.bookHeight,
            isValid: !!state?.attributes?.bookHeight?.min &&
                !!state?.attributes?.bookHeight?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.bookHeight?.min ? state.attributes?.bookHeight?.min : '',
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
                    value: state.attributes?.bookHeight?.max ? state.attributes?.bookHeight?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.bookWidth',
            parameterKey: 'bookWidth',
            machineInputType: 'multiInput',
            value: state?.attributes?.bookWidth,
            isValid: !!state?.attributes?.bookWidth?.min &&
                !!state?.attributes?.bookWidth?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.bookWidth?.min ? state.attributes?.bookWidth?.min : '',
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
                    value: state.attributes?.bookWidth?.max ? state.attributes?.bookWidth?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
    ]
}


export {autoBookCuttingMachine};