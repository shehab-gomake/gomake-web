import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const lightBoxesMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'backgroundSidesLetterMargin', 'sidesLetterMargin', EMeasurementUnits.CM),
        ...minMaxInput(state, 'backgroundSpDownLetterMargin', 'upDownLetterMargin', EMeasurementUnits.CM),
        {
            name: 'machineAttributes.profileInstallationTime',
            parameterKey: 'backgroundInstallationTime',
            machineInputType: 'multiInput',
            value: state.attributes?.backgroundInstallationTime ? state.attributes?.backgroundInstallationTime : {},
            isValid: true,
            inputs: [
                {
                    name: "setupTime",
                    label: "machineAttributes.setupTime",
                    type: "text",
                    placeholder: "machineAttributes.setupTime",
                    parameterKey: "setupTime",
                    unit: EMeasurementUnits.MINUTE,
                    options: [],
                    value: state?.attributes?.backgroundInstallationTime?.setupTime ? state?.attributes?.backgroundInstallationTime?.setupTime : '',
                    machineInputType: 'input',
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    parameterKey: "speed",
                    unit: EMeasurementUnits.LETTERS_PER_HOUR,
                    options: [],
                    value: state?.attributes?.backgroundInstallationTime?.speed ? state?.attributes?.backgroundInstallationTime?.speed : '',
                    machineInputType: 'input',
                },
                {
                    name: "adjustments",
                    label: "machineAttributes.sidesAdjustments",
                    type: "text",
                    placeholder: "machineAttributes.sidesAdjustments",
                    required: true,
                    parameterKey: "adjustments",
                    value: state?.attributes?.backgroundInstallationTime?.adjustments ? state?.attributes?.backgroundInstallationTime?.adjustments : '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    unit: EMeasurementUnits.SQUARE_CM
                },
            ]
        },
        {
            name: 'machineAttributes.verticalProfiles',
            parameterKey: 'backgroundVerticalProfiles',
            machineInputType: 'multiInput',
            value: state.attributes?.backgroundVerticalProfiles ? state.attributes?.backgroundVerticalProfiles : {},
            isValid: true,
            inputs: [
                {
                    name: "profilesNumber",
                    label: "machineAttributes.profilesNumber",
                    type: "text",
                    placeholder: "machineAttributes.profilesNumber",
                    parameterKey: "profilesNumber",
                    options: [],
                    value: state?.attributes?.backgroundVerticalProfiles?.profilesNumber ? state?.attributes?.backgroundVerticalProfiles?.profilesNumber : '',
                    machineInputType: 'input',
                },
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
                    name: "horizontalProfilesNumber",
                    label: "machineAttributes.horizontalProfilesNumber",
                    type: "text",
                    placeholder: "machineAttributes.horizontalProfilesNumber",
                    parameterKey: "profilesNumber",
                    options: [],
                    value: state?.attributes?.backgroundHorizontalProfiles?.profilesNumber ? state?.attributes?.backgroundHorizontalProfiles?.profilesNumber : '',
                    machineInputType: 'input',
                },
                {
                    name: "adjustments",
                    label: "machineAttributes.horizontalProfileAdjustments",
                    type: "text",
                    placeholder: "machineAttributes.horizontalProfileAdjustments",
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
    ];
}

export {lightBoxesMachine};