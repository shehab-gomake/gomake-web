import {COLORS} from "@/widgets/machines/utils/const";

const digitalEnhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: "available",
            label: "machineAttributes.available",
            type: "select",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "foilAvailable",
            value: state?.attributes?.foilAvailable,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: "operationMode",
            label: "machineAttributes.operationMode",
            type: "select",
            placeholder: "machineAttributes.operationMode",
            required: true,
            parameterKey: "foilOperationMode",
            value: state?.attributes?.foilOperationMode,
            options: [{value: 1, text: 'Continuous'}, {value: 2, text: 'regional'}],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: "foilOptions",
            label: "machineAttributes.foilOptions",
            type: "select",
            placeholder: "machineAttributes.foilOptions",
            required: true,
            parameterKey: "foilOptions",
            value: state?.attributes?.foilOptions,
            options: [{value: 1, text: 'Flat'}, {value: 2, text: 'Height',}, {value: 2, text: 'Flat & Height',}],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: 'machineAttributes.additionalColorsCoast',
            parameterKey: 'additionalColorsCoast',
            value: state?.attributes?.additionalColorsCoast ? state?.attributes?.additionalColorsCoast : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.additionalColorsCoast?.length > 0,
            inputs: [
                {
                    name: "color",
                    label: "machineAttributes.color",
                    type: "select",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: "color",
                    value: COLORS[0].value,
                    options:  COLORS
                },
                {
                    name: "cost",
                    label: "machineAttributes.cost",
                    type: "text",
                    placeholder: "machineAttributes.cost",
                    required: true,
                    parameterKey: "cost",
                    options: []
                },

            ]
        },
    ]
};


export {digitalEnhancementMachine}