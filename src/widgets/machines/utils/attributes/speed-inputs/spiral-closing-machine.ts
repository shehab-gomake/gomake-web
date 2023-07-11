import {feedOptions} from "@/widgets/machines/utils/const/feed-options";

const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "setupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "setupTime",
            options: [],
            value: state.attributes?.setupTime ? state.attributes?.setupTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTime,
        },
        {
            name: "actionType",
            label: "machineAttributes.actionType",
            type: "select",
            placeholder: "machineAttributes.actionType",
            required: true,
            parameterKey: "actionType",
            value: state.attributes?.actionType,
            options: feedOptions,
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "closeSpeed",
            label: "machineAttributes.closeSpeed",
            type: "text",
            placeholder: "machineAttributes.closeSpeed",
            required: true,
            parameterKey: "closeSpeed",
            options: [],
            value: state.attributes?.closeSpeed ? state.attributes?.closeSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.closeSpeed,
        },
        {
            name: 'machineAttributes.insertSpeed',
            parameterKey: 'insertSpeed',
            value: state.attributes?.insertSpeed || [],
            isValid: state.attributes?.insertSpeed?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "maxThickness",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: []
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
        }
    ]
}

export {spiralClosingMachine};