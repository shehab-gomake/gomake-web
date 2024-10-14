import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {insertTypeInput} from "@/widgets/machines/utils/attributes/speed-inputs/insert- type-input";

const collectorMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "isManual",
            label: "machineAttributes.isManual",
            type: "switch",
            placeholder: "machineAttributes.isManual",
            required: true,
            parameterKey: "isManual",
            value: state.attributes?.isManual,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed: '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            disabled: state.attributes?.isManual
        },
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "manualSpeed",
            options: [],
            value: state.attributes?.manualSpeed ? state.attributes?.manualSpeed: '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.manualSpeed,
            unit: EMeasurementUnits.PAPER_SETS_PER_HOUR,
            disabled: !state.attributes?.isManual
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
            disabled: state.attributes?.isManual
        },
        ...insertTypeInput(state, state.attributes?.isManual),
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
            unit: EMeasurementUnits.MINUTE,
            disabled: state.attributes?.isManual

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
            disabled: state.attributes?.isManual
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
            disabled: state.attributes?.isManual
        },
        {
            name: "gathered",
            label: "machineAttributes.gathered",
            type: "switch",
            placeholder: "machineAttributes.gathered",
            required: true,
            parameterKey: "gathered",
            value: state.attributes?.gathered,
            options: [],
            machineInputType: 'input',
            isValid: true,
            disabled: state.attributes?.isManual
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