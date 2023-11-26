import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const printingGeneral = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.speedByColor',
            parameterKey: 'speedByColor',
            value: state.attributes?.speedByColor || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "color",
                    label: "machineAttributes.color",
                    type: "text",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: "color",
                    options: []
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    unit: EMeasurementUnits.PPM,
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    options: []
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

export {printingGeneral};

