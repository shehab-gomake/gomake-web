import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const pastingBlocksMachine = (state: Record<string, any>) => {
    return [
        {
            name: "pastingMaxHigh",
            label: "machineAttributes.pastingMaxHigh",
            type: "text",
            placeholder: "machineAttributes.pastingMaxHigh",
            required: true,
            parameterKey: "pastingMaxHigh",
            options: [],
            value: state?.attributes?.pastingMaxHigh ? state?.attributes?.pastingMaxHigh : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.pastingMaxHigh,
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
            value: state?.attributes?.speed ? state?.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            unit: EMeasurementUnits.SQUARE_CM
        },
        {
            name: "pastingDelay",
            label: "machineAttributes.pastingDelay",
            type: "text",
            placeholder: "machineAttributes.pastingDelay",
            required: true,
            parameterKey: "pastingDelay",
            options: [],
            value: state?.attributes?.pastingDelay ? state?.attributes?.pastingDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.pastingDelay,
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
            value: state?.attributes?.cuttingSets ? state?.attributes?.cuttingSets : '',
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
            value: state?.attributes?.baseCollectionSpeed ? state?.attributes?.baseCollectionSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.baseCollectionSpeed,
            unit: EMeasurementUnits.SETS_HOUR
        },
    ]
}

export {pastingBlocksMachine};