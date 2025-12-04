import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const lightBoxesMachine = (state: Record<string, any>) => {
    return [
        {
            name: "flatbedSetupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "flatbedSetupTime",
            value: state?.attributes?.flatbedSetupTime ? state?.attributes?.flatbedSetupTime : '',
            options: [],
            machineInputType: 'input',
            isValid: true,
            unit: EMeasurementUnits.MINUTE,
        },
        {
            name: "flatbedSpeed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "flatbedSpeed",
            value: state?.attributes?.flatbedSpeed ? state?.attributes?.flatbedSpeed : '',
            options: [],
            machineInputType: 'input',
            isValid: true,
            unit: EMeasurementUnits.BOXES_P_MIN,
        },
    ];
}

export {lightBoxesMachine};