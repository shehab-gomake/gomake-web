import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const setupTimeInput = (state: Record<string, any>) => {
    return [
        {
            name: "setupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "setupTime",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state?.attributes?.setupTime ? state?.attributes?.setupTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTime,
        },
    ]
}


export {setupTimeInput};