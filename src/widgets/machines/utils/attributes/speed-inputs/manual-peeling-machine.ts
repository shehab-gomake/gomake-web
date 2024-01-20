import {cuttingLevel} from "@/widgets/machines/utils/const/cutting-level";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";

const manualPeelingMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.MM_P_MIN),
        {
            name: 'machineAttributes.speedByComplexity',
            parameterKey: 'speedByShapeComplexity',
            value: state.attributes?.speedByShapeComplexity || [],
            isValid: state.attributes?.speedByShapeComplexity?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "cuttingLevel",
                    label: "machineAttributes.cuttingLevel",
                    type: "select",
                    placeholder: "machineAttributes.cuttingLevel",
                    required: true,
                    parameterKey: "cuttingLevel",
                    options: [],
                    optionsUrl: '/v1/print-house-config/parameters/shape-complexity'
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "number",
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

export {manualPeelingMachine};