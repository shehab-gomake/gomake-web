import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const maxSpeedInput = (state: Record<string, any>, unit: EMeasurementUnits) => {
    return [
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            parameterKey: "maxSpeed",
            unit,
            options: [],
            value: state?.attributes?.maxSpeed ? state?.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
    ]
}


export {maxSpeedInput};