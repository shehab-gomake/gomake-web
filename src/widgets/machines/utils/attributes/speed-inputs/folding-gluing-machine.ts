import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const foldingGluingMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "speedUnit",
            label: "machineAttributes.speedUnit",
            type: "select",
            placeholder: "machineAttributes.speedUnit",
            required: true,
            parameterKey: "speedUnit",
            value: state.attributes?.speedUnit,
            options: [{value: '1', text: 'Automatic'}, {value: "2", text: 'Manual'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "perUnit",
            label: "machineAttributes.perUnit",
            type: "text",
            placeholder: "machineAttributes.perUnit",
            required: true,
            parameterKey: "perUnit",
            options: [],
            value: state?.attributes?.perUnit ? state?.attributes?.perUnit : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.perUnit,
            disabled: state.attributes?.speedUnit !== '2'
        },
        {
            name: "m/min",
            label: "m/min",
            type: "text",
            placeholder: "",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state?.attributes?.speed ? state?.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            disabled: state.attributes?.speedUnit !== '1'
        },
    ]
}

export {foldingGluingMachine};