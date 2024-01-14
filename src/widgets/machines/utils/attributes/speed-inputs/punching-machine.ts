import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const punchingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "maxHeightClick",
            label: "machineAttributes.maxHeightClick",
            type: "text",
            placeholder: "machineAttributes.maxHeightClick",
            required: true,
            parameterKey: "maxHeightClick",
            options: [],
            value: state.attributes?.maxHeightClick ? state.attributes?.maxHeightClick : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxHeightClick,
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
            isValid: !!state?.attributes?.speed,
            unit: EMeasurementUnits.CHICKS_PM
        },
        {
            name: "clickDelay",
            label: "machineAttributes.clickDelay",
            type: "text",
            placeholder: "machineAttributes.clickDelay",
            required: true,
            parameterKey: "clickDelay",
            options: [],
            value: state.attributes?.clickDelay ? state.attributes?.clickDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.clickDelay,
            unit: EMeasurementUnits.SECOND
        },
        {
            name: "maxHoles",
            label: "machineAttributes.maxHoles",
            type: "text",
            placeholder: "machineAttributes.maxHoles",
            required: true,
            parameterKey: "maxHoles",
            options: [],
            value: state.attributes?.maxHoles ? state.attributes?.maxHoles : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxHoles,
        },
    ]
}

export {punchingMachine};