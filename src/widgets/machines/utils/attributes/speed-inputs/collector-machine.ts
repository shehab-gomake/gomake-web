import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {insertTypeInput} from "@/widgets/machines/utils/attributes/speed-inputs/insert- type-input";

const collectorMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
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
        },
        {
            name: "speedUnit",
            label: "machineAttributes.speedUnit",
            type: "select",
            placeholder: "machineAttributes.speedUnit",
            required: true,
            parameterKey: "speedUnit",
            value: state.attributes?.speedUnit,
            options: [{value: 'pph', text: 'PPH'}, {value: 'cellsSetsPH', text: 'Cells sets PH'}],
            machineInputType: 'input',
            isValid: true,
        },
        ...insertTypeInput(state),
        {
            name: "cellLoadingTime",
            label: "machineAttributes.cellLoadingTime",
            type: "text",
            placeholder: "machineAttributes.cellLoadingTime",
            required: true,
            parameterKey: "cellLoadingTime",
            options: [],
            value: state.attributes?.cellLoadingTime ? state.attributes?.cellLoadingTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cellLoadingTime,
            unit: EMeasurementUnits.MINUTE
        },
        {
            name: "loadingWhileRunning",
            label: "machineAttributes.loadingWhileRunning",
            type: "switch",
            placeholder: "machineAttributes.loadingWhileRunning",
            required: true,
            parameterKey: "loadingWhileRunning",
            value: state.attributes?.loadingWhileRunning,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "cellNumber",
            label: "machineAttributes.cellNumber",
            type: "text",
            placeholder: "machineAttributes.cellNumber",
            required: true,
            parameterKey: "cellNumber",
            options: [],
            value: state.attributes?.cellNumber ? state.attributes?.cellNumber : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cellNumber,
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
            unit: EMeasurementUnits.MM
        },
        {
            name: 'machineAttributes.speedByPaperSizeByColor',
            parameterKey: 'speedByColorBySize',
            value: state.attributes?.speedByColorBySize || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "paperLength",
                    label: "machineAttributes.paperLength",
                    type: "text",
                    placeholder: "machineAttributes.paperLength",
                    required: true,
                    unit: EMeasurementUnits.CM,
                    parameterKey: "paperLength",
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