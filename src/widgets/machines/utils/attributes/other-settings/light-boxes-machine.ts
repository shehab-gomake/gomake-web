import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const lightBoxesMachine = (state: Record<string, any>) => {
    return [
        {
            name: "profileSetupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "profileSetupTime",
            value: state?.attributes?.profileSetupTime ? state?.attributes?.profileSetupTime : '',
            options: [],
            machineInputType: 'input',
            isValid: true,
            unit: EMeasurementUnits.MINUTE,
        },
        {
            name: "profileSpeed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "profileSpeed",
            value: state?.attributes?.profileSpeed ? state?.attributes?.profileSpeed : '',
            options: [],
            machineInputType: 'input',
            isValid: true,
            unit: EMeasurementUnits.CM_P_MIN,
        },
        {
            name: 'machineAttributes.verticalProfiles',
            parameterKey: 'backgroundVerticalProfiles',
            machineInputType: 'multiInput',
            value: state.attributes?.backgroundVerticalProfiles ? state.attributes?.backgroundVerticalProfiles : {},
            isValid: true,
            inputs: [
                {
                    name: "adjustments",
                    label: "machineAttributes.verticalProfileAdjustments",
                    type: "text",
                    placeholder: "machineAttributes.verticalProfileAdjustments",
                    required: true,
                    parameterKey: "adjustments",
                    value: state?.attributes?.backgroundVerticalProfiles?.adjustments || '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.horizontalProfiles',
            parameterKey: 'backgroundHorizontalProfiles',
            machineInputType: 'multiInput',
            value: state.attributes?.backgroundHorizontalProfiles ? state.attributes?.backgroundHorizontalProfiles : {},
            isValid: true,
            inputs: [
                {
                    name: "adjustments",
                    label: "machineAttributes.horizontalProfileAdjustments",
                    type: "text",
                    placeholder: "machineAttributes.horizontalProfileAdjustments",
                    required: true,
                    parameterKey: "adjustments",
                    value: state?.attributes?.backgroundHorizontalProfiles?.adjustments || '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    unit: EMeasurementUnits.CM
                },
            ]
        },
    ];
}

export {lightBoxesMachine};