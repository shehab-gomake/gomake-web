import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const availableCylinders = (state: Record<string, any>) => {
    console.log("state",state)
    return [
        {
            name: 'machineAttributes.availableCylinders',
            parameterKey: 'availableCylinders',
            value: state.attributes?.availableCylinders || [],
            machineInputType: 'multiArrayInput',
            isValid: state.attributes?.availableCylinders?.length > 0,
            inputs: [
                {
                    name: "teethNumber",
                    label: "machineAttributes.teethNumber",
                    type: "number",
                    placeholder: "machineAttributes.teethNumber",
                    required: true,
                    parameterKey: "teethNumber",
                    value: state.attributes?.availableCylinders?.teethNumber ? state.attributes?.availableCylinders?.teethNumber : '',
                    options: [],
                    unit:EMeasurementUnits.CM
                },
            ]
        },
    ]
}


export {availableCylinders};