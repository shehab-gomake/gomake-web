import {speedMethods} from "@/widgets/machines/utils/const/speed-methods";

const foldingGluingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "speedMethod",
            label: "machineAttributes.speed",
            type: "select",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speedMethod",
            value: state.attributes?.speedMethod,
            options: speedMethods,
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
        },
    ]
}

export {foldingGluingMachine};