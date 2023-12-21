import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const collectorMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "loadTime",
            label: "machineAttributes.loadTime",
            type: "text",
            placeholder: "machineAttributes.loadTime",
            required: true,
            parameterKey: "loadTime",
            options: [],
            value: state.attributes?.loadTime ? state.attributes?.loadTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.loadTime,
            unit: EMeasurementUnits.MINUTE
        },
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speedSet",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed: '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            unit: EMeasurementUnits.SPH
        },
        {
            name: "cellChargingTime",
            label: "machineAttributes.cellChargingTime",
            type: "text",
            placeholder: "machineAttributes.cellChargingTime",
            required: true,
            parameterKey: "cellChargingTime",
            options: [],
            value: state.attributes?.cellChargingTime ? state.attributes?.cellChargingTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cellChargingTime,
        },
        {
            name: "loadingWhileRunning",
            label: "machineAttributes.loadingWhileRunning",
            type: "switch",
            placeholder: "machineAttributes.loadingWhileRunning",
            required: true,
            parameterKey: "loadingWhileRunning",
            value: state.attributes?.loadingWhileRunning,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "cellsAmount",
            label: "machineAttributes.cellsAmount",
            type: "text",
            placeholder: "machineAttributes.cellsAmount",
            required: true,
            parameterKey: "cellsAmount",
            options: [],
            value: state.attributes?.cellsAmount ? state.attributes?.cellsAmount : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cellsAmount,
        },
        {
            name: "maxThicknessCells",
            label: "machineAttributes.maxThicknessCells",
            type: "text",
            placeholder: "machineAttributes.maxThicknessCells",
            required: true,
            parameterKey: "maxThicknessCells",
            options: [],
            value: state.attributes?.maxThicknessCells ? state.attributes?.maxThicknessCells : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxThicknessCells,
        },
        {
            name: 'machineAttributes.speedByPaperSizeByColor',
            parameterKey: 'speedByColorBySize',
            value: state.attributes?.speedByColorBySize || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "mediaLength",
                    label: "machineAttributes.lengthDirection",
                    type: "text",
                    placeholder: "machineAttributes.lengthDirection",
                    required: true,
                    unit: EMeasurementUnits.CM,
                    parameterKey: "mediaLength",
                    options: []
                },
                {
                    name: "speed",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    unit: EMeasurementUnits.PERCENTAGE,
                    parameterKey: "speed",
                    options: []
                },
            ]
        },
    ]
}

export {collectorMachine};