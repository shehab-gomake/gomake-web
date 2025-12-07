import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const lightBoxes = (state: Record<string, any>) => {
    return [
        {
            name: "ledSetupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "ledSetupTime",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state.attributes?.ledSetupTime ? state.attributes?.ledSetupTime : ''
        },
        {
            name: 'machineAttributes.ledUnitsInstallation',
            parameterKey: 'ledUnitsInstallation',
            machineInputType: 'multiInput',
            value: state.attributes?.ledUnitsInstallation ? state.attributes?.ledUnitsInstallation : {},
            isValid: true,
            inputs: [
                {
                    name: "speedLedInstall",
                    label: "machineAttributes.speedLedInstall",
                    type: "text",
                    placeholder: "machineAttributes.speedLedInstall",
                    required: true,
                    parameterKey: "speedLedInstall",
                    unit: EMeasurementUnits.MINUTE,
                    options: [],
                    value: state.attributes?.ledUnitsInstallation?.speedLedInstall ? state.attributes?.ledUnitsInstallation?.speedLedInstall : '',
                    machineInputType: 'input',
                },
                {
                    name: "letterInstallTime",
                    label: "machineAttributes.letterInstallTime",
                    type: "text",
                    placeholder: "machineAttributes.letterInstallTime",
                    required: true,
                    parameterKey: "letterInstallTime",
                    unit: EMeasurementUnits.MINUTE,
                    options: [],
                    value: state.attributes?.ledUnitsInstallation?.letterInstallTime ? state.attributes?.ledUnitsInstallation?.letterInstallTime : '',
                    machineInputType: 'input',
                },
            ]
        },
        {
            name: 'machineAttributes.ledRollInstallation',
            parameterKey: 'ledRollInstallation',
            machineInputType: 'multiInput',
            value: state.attributes?.ledRollInstallation ? state.attributes?.ledRollInstallation : {},
            isValid: true,
            inputs: [
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    unit: EMeasurementUnits.CM_P_MIN,
                    options: [],
                    value: state.attributes?.ledRollInstallation?.speed ? state.attributes?.ledRollInstallation?.speed : '',
                    machineInputType: 'input',
                },
                {
                    name: "letterInstallTime",
                    label: "machineAttributes.letterInstallTime",
                    type: "text",
                    placeholder: "machineAttributes.letterInstallTime",
                    required: true,
                    parameterKey: "letterInstallTime",
                    unit: EMeasurementUnits.MINUTE,
                    options: [],
                    value: state.attributes?.ledRollInstallation?.letterInstallTime ? state.attributes?.ledRollInstallation?.letterInstallTime : '',
                    machineInputType: 'input',
                },
            ]
        },
    ]
}

export {lightBoxes};