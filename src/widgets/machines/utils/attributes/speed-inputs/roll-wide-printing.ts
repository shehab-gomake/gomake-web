import {quality} from "@/widgets/machines/utils/const/quality";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";

const rollWidePrinting = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.SQUARE_METER),
        {
            name: 'machineAttributes.speedByQuality',
            parameterKey: 'speedByQuality',
            value: state.attributes?.speedByQuality || [],
            machineInputType: 'multiArrayInput',
            isValid: state.attributes?.speedByColor?.length > 0,
            inputs: [
                {
                    name: "quality",
                    label: "machineAttributes.quality",
                    type: "select",
                    placeholder: "machineAttributes.quality",
                    required: true,
                    parameterKey: "quality",
                    options: quality
                },
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    required: true,
                    parameterKey: "speed",
                    unit: EMeasurementUnits.SQUARE_METER,
                    options: []
                },
            ]
        },

        {
            name: 'machineAttributes.speedByWidth',
            parameterKey: 'speedByWidth',
            value: state.attributes?.speedByWidth || [],
            isValid: state.attributes?.speedByWidth?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "width",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    unit: EMeasurementUnits.CM,
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: []
                },

            ]
        }
    ]
}

export {rollWidePrinting};