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
            value: state?.attributes?.sidesInstallSetupTime,
            options: [],
            machineInputType: 'input',
            isValid: true,
            unit: EMeasurementUnits.MINUTE,
        },
        {
            name: 'machineAttributes.welding',
            parameterKey: 'sidesWelding',
            machineInputType: 'multiInput',
            value: state.attributes?.sidesWelding ? state.attributes?.sidesWelding : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.welding",
                    type: "switch",
                    placeholder: "machineAttributes.welding",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.sidesWelding?.isAvailable ? state.attributes?.sidesWelding?.isAvailable : false
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    unit: EMeasurementUnits.CM_P_MIN,
                    options: [],
                    value: state?.attributes?.sidesWelding?.speed ? state?.attributes?.sidesWelding?.speed : '',
                    machineInputType: 'input',
                    disabled: !state.attributes?.sidesWelding?.isAvailable
                },
            ]
        },
        {
            name: 'machineAttributes.gluing',
            parameterKey: 'sidesGluing',
            machineInputType: 'multiInput',
            value: state.attributes?.sidesGluing ? state.attributes?.sidesGluing : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.gluing",
                    type: "switch",
                    placeholder: "machineAttributes.gluing",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.sidesGluing?.isAvailable ? state.attributes?.sidesGluing?.isAvailable : false
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    unit: EMeasurementUnits.CM_P_MIN,
                    options: [],
                    value: state?.attributes?.sidesGluing?.speed ? state?.attributes?.sidesGluing?.speed : '',
                    machineInputType: 'input',
                    disabled: !state.attributes?.sidesGluing?.isAvailable
                },
            ]
        },
    ]
}


export {lightBoxes};