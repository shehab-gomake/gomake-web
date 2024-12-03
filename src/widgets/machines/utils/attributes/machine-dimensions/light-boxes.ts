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
            name: "ledAmount",
            label: "machineAttributes.ledAmount",
            type: "text",
            placeholder: "machineAttributes.ledAmount",
            required: true,
            parameterKey: "ledAmount",
            options: [],
            value: state.attributes?.ledAmount ? state.attributes?.ledAmount : ''
        },
        {
            name: "speedLedInstall",
            label: "machineAttributes.speedLedInstall",
            type: "text",
            placeholder: "machineAttributes.speedLedInstall",
            required: true,
            parameterKey: "speedLedInstall",
            options: [],
            value: state.attributes?.speedLedInstall ? state.attributes?.speedLedInstall : '',
            unit: EMeasurementUnits.MINUTE
        },
        {
            name: "letterInstallTime",
            label: "machineAttributes.letterInstallTime",
            type: "text",
            placeholder: "machineAttributes.letterInstallTime",
            required: true,
            parameterKey: "letterInstallTime",
            options: [],
            value: state.attributes?.letterInstallTime ? state.attributes?.letterInstallTime : '',
            unit: EMeasurementUnits.MINUTE
        },
    ]
}

export {lightBoxes};