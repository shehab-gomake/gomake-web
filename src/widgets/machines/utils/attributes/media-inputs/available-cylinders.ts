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
                    name: "width",
                    label: "machineAttributes.width",
                    type: "number",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    unit:EMeasurementUnits.CM
                },
                {
                    name: "length",
                    label: "machineAttributes.length",
                    type: "number",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    unit:EMeasurementUnits.CM
                },
            ]
        },
    ]
}


export {availableCylinders};