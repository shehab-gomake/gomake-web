import {insertTypeInput} from "@/widgets/machines/utils/attributes/speed-inputs/insert- type-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const bookletMachine = (state: Record<string, any>) => {
    return [
        {
            name: "isAvailable",
            label: "machineAttributes.isAvailable",
            type: "switch",
            placeholder: "",
            required: true,
            parameterKey: "isAvailableCollectorUnit",
            value: !!state.attributes?.isAvailableCollectorUnit,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "isManual",
            label: "machineAttributes.isManual",
            type: "switch",
            placeholder: "machineAttributes.isManual",
            required: true,
            parameterKey: "isManualCollector",
            value: state.attributes?.isManualCollector,
            options: [],
            machineInputType: 'input',
            isValid: true,
            disabled: !state.attributes?.isAvailableCollectorUnit,

        },
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "collectorManualSpeed",
            options: [],
            value: state.attributes?.collectorManualSpeed ? state.attributes?.collectorManualSpeed: '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.collectorManualSpeed,
            unit: EMeasurementUnits.PAPER_SETS_PER_HOUR,
            disabled: !state.attributes?.isManualCollector || !state.attributes?.isAvailableCollectorUnit
        },
        {
            name: "collectorSpeed",
            label: "machineAttributes.collectorSpeed",
            type: "text",
            placeholder: "machineAttributes.collectorSpeed",
            required: true,
            parameterKey: "collectorSpeed",
            value: state.attributes?.collectorSpeed,
            options: [],
            machineInputType: 'input',
            isValid: true,
            disabled: !state.attributes?.isAvailableCollectorUnit || state.attributes?.isManualCollector,
            unit: EMeasurementUnits.PPH
        },
        ...insertTypeInput(state, !state.attributes?.isAvailableCollectorUnit || state.attributes?.isManualCollector),

        {
            name: "cellNumber",
            label: "machineAttributes.cellNumber",
            type: "text",
            placeholder: "machineAttributes.cellNumber",
            required: true,
            parameterKey: "cellNumber",
            value: state.attributes?.cellNumber,
            options: [],
            machineInputType: 'input',
            isValid: true,
            disabled: !state.attributes?.isAvailableCollectorUnit || state.attributes?.isManualCollector
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
            unit: EMeasurementUnits.MINUTE,
            disabled: !state.attributes?.isAvailableCollectorUnit || state.attributes?.isManualCollector

        },
        {
            name: "loadingInRun",
            label: "machineAttributes.loadingInRun",
            type: "switch",
            placeholder: "machineAttributes.loadingInRun",
            required: true,
            parameterKey: "loadingInRun",
            options: [],
            value: state.attributes?.loadingInRun ? state.attributes?.loadingInRun : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.loadingInRun,
            disabled: !state.attributes?.isAvailableCollectorUnit || state.attributes?.isManualCollector
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
            disabled: !state.attributes?.isAvailableCollectorUnit || state.attributes?.isManualCollector
        },
        {
            name: 'machineAttributes.speedByPaperSizeByColor',
            parameterKey: 'collectorSpeedByMediaLength',
            value: state.attributes?.collectorSpeedByMediaLength || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            disabled: !state.attributes?.isAvailableCollectorUnit || state.attributes?.isManualCollector,
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

export {bookletMachine};