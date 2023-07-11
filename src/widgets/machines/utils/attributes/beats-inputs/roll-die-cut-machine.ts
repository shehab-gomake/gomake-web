import {shapes} from "@/widgets/machines/utils/const/shapes";

const rollDieCutMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.basicPrice',
            parameterKey: 'basicPrice',
            value: state?.attributes?.basicPrice ? state?.attributes?.basicPrice : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.basicPrice?.length > 0,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.shape",
                    type: "select",
                    placeholder: "machineAttributes.shape",
                    required: true,
                    parameterKey: "shape",
                    options: shapes
                },
                {
                    name: "",
                    label: "machineAttributes.price",
                    type: "text",
                    placeholder: "machineAttributes.price",
                    required: true,
                    parameterKey: "price",
                    options: []
                },

            ]
        },
        {
            name: 'machineAttributes.costBySize',
            parameterKey: 'costBySize',
            value: state?.attributes?.costBySize ? state?.attributes?.costBySize : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.costBySize?.length > 0,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.cm2",
                    type: "text",
                    placeholder: "machineAttributes.cm2",
                    required: true,
                    parameterKey: "cm2",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.costPercentage",
                    type: "text",
                    placeholder: "machineAttributes.costPercentage",
                    required: true,
                    parameterKey: "costPercentage",
                    options: []
                },

            ]
        },
    ]
};

export {rollDieCutMachine};