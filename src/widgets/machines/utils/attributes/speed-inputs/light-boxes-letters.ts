import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const lightBoxesLetters = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'lettersSidesWelding',
            machineInputType: 'multiInput',
            value: state.attributes?.lettersSidesWelding ? state.attributes?.lettersSidesWelding : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.lettersSidesWelding",
                    type: "switch",
                    placeholder: "machineAttributes.lettersSidesWelding",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.lettersSidesWelding?.isAvailable ? state.attributes?.lettersSidesWelding?.isAvailable : ''
                },
                {
                    name: "setupTime",
                    label: "machineAttributes.setupTime",
                    type: "text",
                    placeholder: "machineAttributes.setupTime",
                    required: true,
                    parameterKey: "setupTime",
                    options: [],
                    value: state?.attributes?.lettersSidesWelding?.setupTime,
                    multiple: true,
                    unit: EMeasurementUnits.MINUTE,
                    disabled: !state.attributes?.lettersSidesWelding?.isAvailable
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    options: [],
                    value: state?.attributes?.lettersSidesWelding?.speed,
                    multiple: true,
                    disabled: !state.attributes?.lettersSidesWelding?.isAvailable,
                    unit: EMeasurementUnits.LETTERS_PER_HOUR
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
                    disabled: !state.attributes?.lettersSidesWelding?.isAvailable,
                    isValid: true,
                    unit: EMeasurementUnits.SQUARE_CM
                },
            ]
        },
        {
            name: '',
            parameterKey: 'profileWelding',
            machineInputType: 'multiInput',
            value: state.attributes?.profileWelding ? state.attributes?.profileWelding : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.profileWelding",
                    type: "switch",
                    placeholder: "machineAttributes.profileWelding",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.profileWelding?.isAvailable ? state.attributes?.profileWelding?.isAvailable : ''
                },
                {
                    name: "setupTime",
                    label: "machineAttributes.setupTime",
                    type: "text",
                    placeholder: "machineAttributes.setupTime",
                    required: true,
                    parameterKey: "setupTime",
                    options: [],
                    value: state?.attributes?.profileWelding?.setupTime,
                    multiple: true,
                    disabled: !state.attributes?.profileWelding?.isAvailable,
                    unit: EMeasurementUnits.MINUTE
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    options: [],
                    value: state?.attributes?.profileWelding?.speed,
                    multiple: true,
                    disabled: !state.attributes?.profileWelding?.isAvailable,
                    unit: EMeasurementUnits.PROFILE_PER_HOUR
                },
            ]
        },
    ]
}


export {lightBoxesLetters};