import {cuttingLevel} from "@/widgets/machines/utils/const/cutting-level";

const flatbedCuttingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
        },
        {
            name: "feeder",
            label: "machineAttributes.feeder",
            type: "switch",
            placeholder: "machineAttributes.feeder",
            required: true,
            parameterKey: "feeder",
            value: state.attributes?.feeder,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "feederSpeed",
            label: "machineAttributes.feederSpeed",
            type: "text",
            placeholder: "machineAttributes.feederSpeed",
            required: true,
            parameterKey: "feederSpeed",
            options: [],
            value: state.attributes?.feederSpeed ? state.attributes?.feederSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.feederSpeed,
        },
        {
            name: '',
            parameterKey: 'speedByMediaWeight',
            value: state.attributes?.speedByMediaWeight || [],
            isValid: state.attributes?.speedByMediaWeight?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "cuttingLevel",
                    label: "machineAttributes.cuttingLevel",
                    type: "select",
                    placeholder: "machineAttributes.cuttingLevel",
                    required: true,
                    parameterKey: "cuttingLevel",
                    options: cuttingLevel,
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
        },

    ]
}

export {flatbedCuttingMachine};