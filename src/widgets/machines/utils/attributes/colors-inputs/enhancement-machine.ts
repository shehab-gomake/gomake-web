import {additionalColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/additional-colors-input";

const enhancementMachine = (state: Record<string, any>) => {
    return [
        {
            name: "available",
            label: "machineAttributes.available",
            type: "switch",
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
        ...additionalColorsInput(state),
    ]
};


export {enhancementMachine}