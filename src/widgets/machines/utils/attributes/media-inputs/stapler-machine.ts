import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const staplerMachine = (state: Record<string, any>) => {
    return [
        {
            name: "maxStaplerThickness",
            label: "machineAttributes.maxStaplerThickness",
            type: "text",
            placeholder: "machineAttributes.maxStaplerThickness",
            required: true,
            parameterKey: "maxStaplerThickness",
            value: state?.attributes?.maxStaplerThickness,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxStaplerThickness,
            unit: EMeasurementUnits.MM
        },
        {
            name: "maxStapleLength",
            label: "machineAttributes.maxStapleLength",
            type: "text",
            placeholder: "machineAttributes.maxStapleLength",
            required: true,
            parameterKey: "maxStapleHeight",
            value: state?.attributes?.maxStapleHeight,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxStapleHeight,
            unit: EMeasurementUnits.CM
        },
        {
            name: "maxStapleWidth",
            label: "machineAttributes.maxStapleWidth",
            type: "text",
            placeholder: "machineAttributes.maxStapleWidth",
            required: true,
            parameterKey: "maxStapleWidth",
            value: state?.attributes?.maxStapleWidth,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxStapleWidth,
            unit: EMeasurementUnits.CM
        },
    ]
}


export {staplerMachine};