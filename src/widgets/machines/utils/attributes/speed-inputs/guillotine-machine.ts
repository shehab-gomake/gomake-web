import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const guillotineMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
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
            unit: EMeasurementUnits.CUTS_PH
        },
        {
            name: "backgaugeSpeed",
            label: "machineAttributes.backgaugeSpeed",
            type: "text",
            placeholder: "machineAttributes.backgaugeSpeed",
            required: true,
            parameterKey: "backgaugeSpeed",
            options: [],
            value: state.attributes?.backgaugeSpeed ? state.attributes?.backgaugeSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.backgaugeSpeed,
            unit: EMeasurementUnits.CM_SEC
        },
        {
            name: "cuttingHeight",
            label: "machineAttributes.cuttingHeight",
            type: "text",
            placeholder: "machineAttributes.cuttingHeight",
            required: true,
            parameterKey: "cuttingHeight",
            options: [],
            value: state.attributes?.cuttingHeight ? state.attributes?.cuttingHeight : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cuttingHeight,
            unit: EMeasurementUnits.CM
        },
    ]
}

export {guillotineMachine};