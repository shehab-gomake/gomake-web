import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const sideColoringMachine = (state: Record<string, any>) => {
    return [
        {
            name: "maxHeightColor",
            label: "machineAttributes.maxHeightColor",
            type: "text",
            placeholder: "machineAttributes.maxHeightColor",
            required: true,
            parameterKey: "maxHeightColor",
            options: [],
            value: state.attributes?.maxHeightColor ? state.attributes?.maxHeightColor : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxHeightColor,
            unit: EMeasurementUnits.CM
        },
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
            unit: EMeasurementUnits.SQUARE_CM,
            isValid: !!state?.attributes?.speed,
        },
        {
            name: "colorDelay",
            label: "machineAttributes.colorDelay",
            type: "text",
            placeholder: "machineAttributes.colorDelay",
            required: true,
            parameterKey: "colorDelay",
            options: [],
            value: state.attributes?.colorDelay ? state.attributes?.colorDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.colorDelay,
            unit: EMeasurementUnits.SECOND
        },
        {
            name: "cuttingSets",
            label: "machineAttributes.cuttingSets",
            type: "text",
            placeholder: "machineAttributes.cuttingSets",
            required: true,
            parameterKey: "cuttingSets",
            options: [],
            value: state.attributes?.cuttingSets ? state.attributes?.cuttingSets : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cuttingSets,
            unit: EMeasurementUnits.SETS_HOUR
        },
        {
            name: "baseCollectionSpeed",
            label: "machineAttributes.baseCollectionSpeed",
            type: "text",
            placeholder: "machineAttributes.baseCollectionSpeed",
            required: true,
            parameterKey: "baseCollectionSpeed",
            options: [],
            value: state.attributes?.baseCollectionSpeed ? state.attributes?.baseCollectionSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.baseCollectionSpeed,
            unit: EMeasurementUnits.SETS_HOUR
        },
    ]
}

export {sideColoringMachine};