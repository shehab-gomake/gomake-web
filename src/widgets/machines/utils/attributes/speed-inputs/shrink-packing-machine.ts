import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const shrinkPackingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            unit: EMeasurementUnits.PACKAGE_P_H
        },

    ]
}

export {shrinkPackingMachine};