import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const lightBoxes = (state: Record<string, any>) => {
    return [
        {
            name: "sidesInstallSetupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "sidesInstallSetupTime",
            value: state?.attributes?.mediaType,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "sideInstallSpeed",
            value: state?.attributes?.sideInstallSpeed,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "adjustments",
            label: "machineAttributes.sidesAdjustments",
            type: "text",
            placeholder: "machineAttributes.sidesAdjustments",
            required: true,
            parameterKey: "sidesAdjustments",
            value: state?.attributes?.sidesAdjustments,
            options: [],
            machineInputType: 'input',
            isValid: true,
            unit: EMeasurementUnits.SQUARE_CM
        },
    ]
}


export {lightBoxes};