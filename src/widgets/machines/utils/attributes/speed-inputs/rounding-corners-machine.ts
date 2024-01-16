import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const roundingCornersMachine = (state: Record<string, any>) => {
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
            name: "maxCorners",
            label: "machineAttributes.maxCorners",
            type: "text",
            placeholder: "machineAttributes.maxCorners",
            required: true,
            parameterKey: "maxCorners",
            options: [],
            value: state.attributes?.maxCorners ? state.attributes?.maxCorners : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxCorners,
        },
    ]
}

export {roundingCornersMachine};