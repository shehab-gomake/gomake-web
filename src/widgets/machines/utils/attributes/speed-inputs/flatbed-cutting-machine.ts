import {cuttingLevel} from "@/widgets/machines/utils/const/cutting-level";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const flatbedCuttingMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
        },
        {
            name: "feederSpeed",
            label: "machineAttributes.feederSpeed",
            type: "text",
            placeholder: "machineAttributes.feederSpeed",
            required: true,
            parameterKey: "feederSpeed",
            options: [],
            value: state.attributes?.feederSpeed ? state.attributes?.feederSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.feederSpeed,
        },
        {
            name: 'machineAttributes.speedByComplexity',
            parameterKey: 'speedByMediaWeight',
            value: state.attributes?.speedByMediaWeight || [],
            isValid: state.attributes?.speedByMediaWeight?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "cuttingLevel",
                    label: "machineAttributes.cuttingLevel",
                    type: "select",
                    placeholder: "machineAttributes.cuttingLevel",
                    required: true,
                    parameterKey: "cuttingLevel",
                    options: cuttingLevel,
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },

            ]
        },

    ]
}

export {flatbedCuttingMachine};