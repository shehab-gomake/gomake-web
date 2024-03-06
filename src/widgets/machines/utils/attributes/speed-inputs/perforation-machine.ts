import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const perforationMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.METER),
        {
            name: "unitDelay",
            label: "machineAttributes.unitDelay",
            type: "text",
            placeholder: "machineAttributes.unitDelay",
            required: true,
            parameterKey: "unitDelay",
            options: [],
            value: state?.attributes?.unitDelay ? state?.attributes?.unitDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.unitDelay,
        },
        {
            name: "perforationDelay",
            label: "machineAttributes.perforationDelay",
            type: "text",
            placeholder: "machineAttributes.perforationDelay",
            required: true,
            parameterKey: "perforationDelay",
            options: [],
            value: state?.attributes?.perforationDelay ? state?.attributes?.perforationDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.perforationDelay,
        },
        {
            name: 'machineAttributes.speedByMediaWeight',
            parameterKey: 'speedByMediaWeight',
            value: state.attributes?.speedByMediaWeight || [],
            isValid: true,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.weight",
                    type: "text",
                    placeholder: "machineAttributes.weight",
                    required: true,
                    parameterKey: "weight",
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

export {perforationMachine};