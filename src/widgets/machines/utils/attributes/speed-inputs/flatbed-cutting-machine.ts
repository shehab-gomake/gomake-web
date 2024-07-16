import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const flatbedCuttingMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state), 
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            unit: EMeasurementUnits.MM_P_SECOND,
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
        },
        {
            name: "feederSpeed",
            label: "machineAttributes.feederSpeed",
            type: "text",
            placeholder: "machineAttributes.feederSpeed",
            required: true,
            parameterKey: "feederSpeed",
            options: [],
            unit: EMeasurementUnits.SPH,
            value: state.attributes?.feederSpeed ? state.attributes?.feederSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.feederSpeed,
        },
        {
            name: 'machineAttributes.speedByComplexity',
            parameterKey: 'speedByShapeComplexity',
            value: state.attributes?.speedByShapeComplexity || [],
            isValid: state.attributes?.speedByShapeComplexity?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "shape",
                    label: "machineAttributes.shape",
                    type: "select",
                    placeholder: "machineAttributes.shape",
                    required: true,
                    parameterKey: "shape",
                    options: [],
                    optionsUrl: '/v1/print-house-config/parameters/shape-complexity'
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "number",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },

            ]
        },
        {
            name: 'machineAttributes.speedByPaperSizeByColor',
            parameterKey: 'speedByColorBySize',
            value: state.attributes?.speedByColorBySize || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "mediaLength",
                    label: "machineAttributes.lengthDirection",
                    type: "text",
                    placeholder: "machineAttributes.lengthDirection",
                    required: true,
                    unit: EMeasurementUnits.CM,
                    parameterKey: "mediaLength",
                    options: []
                },
                {
                    name: "speed",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    unit: EMeasurementUnits.PERCENTAGE,
                    parameterKey: "speed",
                    options: []
                },
            ]
        },

        {
            name: 'machineAttributes.speedByMediaWeight',
            parameterKey: 'speedByMediaWeight',
            value: state.attributes?.speedByMediaWeight || [],
            isValid: true,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.weight",
                    type: "text",
                    placeholder: "machineAttributes.weight",
                    required: true,
                    unit: EMeasurementUnits.GRAM,
                    parameterKey: "weight",
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    unit: EMeasurementUnits.PERCENTAGE,
                    required: true,
                    parameterKey: "speedPercentage",
                    options: []
                },
            ]
        }
    ]
}

export {flatbedCuttingMachine};