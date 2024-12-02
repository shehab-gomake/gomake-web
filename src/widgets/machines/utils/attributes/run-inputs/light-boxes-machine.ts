import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";

const lightBoxesMachine = (state: Record<string, any>) => {
    return [
        ...minMaxInput(state, 'flatbedSidesLetterMargin', 'sidesLetterMargin', EMeasurementUnits.CM),
        ...minMaxInput(state, 'flatbedUpDownLetterMargin', 'upDownLetterMargin', EMeasurementUnits.CM),
        {
            name: 'machineAttributes.profileInstallationTime',
            parameterKey: 'flatbedInstallationTime',
            machineInputType: 'multiInput',
            value: state.attributes?.flatbedInstallationTime ? state.attributes?.flatbedInstallationTime : {},
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
                    value: state?.attributes?.flatbedInstallationTime?.setupTime ? state?.attributes?.flatbedInstallationTime?.setupTime : '',
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
                    value: state?.attributes?.flatbedInstallationTime?.speed ? state?.attributes?.flatbedInstallationTime?.speed : '',
                    machineInputType: 'input',
                },
                {
                    name: "adjustments",
                    label: "machineAttributes.sidesAdjustments",
                    type: "text",
                    placeholder: "machineAttributes.sidesAdjustments",
                    required: true,
                    parameterKey: "adjustments",
                    value: state?.attributes?.flatbedInstallationTime?.adjustments ? state?.attributes?.flatbedInstallationTime?.adjustments : '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    unit: EMeasurementUnits.SQUARE_CM
                },
            ]
        },
        {
            name: 'machineAttributes.verticalFarm',
            parameterKey: 'flatbedVerticalFarm',
            machineInputType: 'multiInput',
            value: state.attributes?.flatbedVerticalFarm ? state.attributes?.flatbedVerticalFarm : {},
            isValid: true,
            inputs: [
                {
                    name: "profilesNumber",
                    label: "machineAttributes.profilesNumber",
                    type: "text",
                    placeholder: "machineAttributes.profilesNumber",
                    parameterKey: "profilesNumber",
                    options: [],
                    value: state?.attributes?.flatbedVerticalFarm?.profilesNumber ? state?.attributes?.flatbedVerticalFarm?.profilesNumber : '',
                    machineInputType: 'input',
                },
                {
                    name: "horizontalProfilesStabilizingAmount",
                    label: "machineAttributes.horizontalProfilesStabilizingAmount",
                    type: "text",
                    placeholder: "machineAttributes.horizontalProfilesStabilizingAmount",
                    required: true,
                    parameterKey: "profilesStabilizingAmount",
                    value: state?.attributes?.flatbedVerticalFarm?.profilesStabilizingAmount || '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    unit: EMeasurementUnits.METER
                },
            ]
        },
        {
            name: 'machineAttributes.horizontalFarm',
            parameterKey: 'flatbedHorizontalFarm',
            machineInputType: 'multiInput',
            value: state.attributes?.flatbedHorizontalFarm ? state.attributes?.flatbedHorizontalFarm : {},
            isValid: true,
            inputs: [
                {
                    name: "maxDistance",
                    label: "machineAttributes.horizontalProfilesMaxDistance",
                    type: "text",
                    placeholder: "machineAttributes.horizontalProfilesMaxDistance",
                    parameterKey: "maxDistance",
                    options: [],
                    value: state?.attributes?.flatbedHorizontalFarm?.maxDistance ? state?.attributes?.flatbedHorizontalFarm?.maxDistance : '',
                    machineInputType: 'input',
                },
                {
                    name: "horizontalProfilesStabilizingAmount",
                    label: "machineAttributes.horizontalProfilesStabilizingAmount",
                    type: "text",
                    placeholder: "machineAttributes.horizontalProfilesStabilizingAmount",
                    required: true,
                    parameterKey: "profilesStabilizingAmount",
                    value: state?.attributes?.flatbedHorizontalFarm?.flatbedHorizontalFarm || '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    unit: EMeasurementUnits.METER
                },
            ]
        },
    ];
}

export {lightBoxesMachine};