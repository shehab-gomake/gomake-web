import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const packageTyingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "packagePerHour",
            label: "machineAttributes.packagePerHour",
            type: "text",
            placeholder: "machineAttributes.packagePerHour",
            required: true,
            parameterKey: "packagePerHour",
            options: [],
            value: state.attributes?.packagePerHour ? state.attributes?.packagePerHour : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.packagePerHour,
            unit: EMeasurementUnits.PACKAGE_P_H
        },

    ]
}

export {packageTyingMachine};