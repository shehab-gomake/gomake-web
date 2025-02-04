import {quality} from "@/widgets/machines/utils/const/quality";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const flatbedWidePrinting = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: 'machineAttributes.speedByColor',
            parameterKey: 'speedByColor',
            value: state.attributes?.speedByColor || [],
            machineInputType: 'multiArrayInput',
            isValid: state.attributes?.speedByColor?.length > 0,
            inputs: [
                {
                    name: "quality",
                    label: "machineAttributes.quality",
                    type: "select",
                    placeholder: "machineAttributes.quality",
                    required: true,
                    parameterKey: "quality",
                    options: quality
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    options: []
                },
            ]
        },

        {
            name: 'machineAttributes.speedByMediaWeight',
            parameterKey: 'speedByMediaWeight',
            value: state.attributes?.speedByMediaWeight || [],
            isValid: state.attributes?.speedByMediaWeight?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.weight",
                    type: "text",
                    placeholder: "machineAttributes.weight",
                    required: true,
                    parameterKey: "weight",
                    options: []
                },
                {
                    name: "targetWeight",
                    label: "machineAttributes.targetWeight",
                    type: "text",
                    placeholder: "machineAttributes.targetWeight",
                    required: true,
                    parameterKey: "targetWeight",
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: []
                },

            ]
        }
    ]
}

export {flatbedWidePrinting};