import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const bookletMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "",
            label: "machineAttributes.maxThicknessBeforeFolding",
            type: "text",
            placeholder: "machineAttributes.maxThicknessBeforeFolding",
            required: true,
            parameterKey: "maxThicknessBeforeFolding",
            options: [],
            value: state.attributes?.maxThicknessBeforeFolding ? state.attributes?.maxThicknessBeforeFolding : '',
            unit: EMeasurementUnits.MM
        },
        {
            name: 'machineAttributes.width',
            parameterKey: 'width',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.width?.min &&
                !!state?.attributes?.width?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.width?.min ? state.attributes?.width?.min : '',
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
                    value: state.attributes?.width?.max ? state.attributes?.width?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.length',
            parameterKey: 'length',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.length?.min &&
                !!state?.attributes?.length?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.length?.min ? state.attributes?.length?.min : '',
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
                    value: state.attributes?.length?.max ? state.attributes?.length?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.paperThickness',
            parameterKey: 'paperThickness',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.paperThickness?.min &&
                !!state?.attributes?.paperThickness?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.paperThickness?.min ? state.attributes?.paperThickness?.min : '',
                    unit: EMeasurementUnits.UM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.paperThickness?.max ? state.attributes?.paperThickness?.max : '',
                    unit: EMeasurementUnits.UM
                },
            ]
        },
        {
            name: "squareSpineOption",
            label: "machineAttributes.squareSpineOption",
            type: "switch",
            placeholder: "machineAttributes.squareSpineOption",
            required: true,
            parameterKey: "squareSpineOption",
            value: state.attributes?.squareSpineOption,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
    ]
}


export {bookletMachine};