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
        {
            name: 'machineAttributes.booksCutting',
            parameterKey: 'booksCutting',
            machineInputType: 'multiInput',
            value: state.attributes?.booksCutting ? state.attributes?.booksCutting : {},
            isValid: true,
            inputs: [
                {
                    name: "speed",
                    label: "machineAttributes.speed",
                    type: "text",
                    placeholder: "machineAttributes.speed",
                    parameterKey: "speed",
                    options: [],
                    value: state.attributes?.booksCutting?.speed ? state.attributes?.booksCutting?.speed : '',
                    unit: EMeasurementUnits.CUTS_PH
                },
                {
                    name: "maxCuttingHeight",
                    label: "machineAttributes.maxCuttingHeight",
                    type: "text",
                    placeholder: "machineAttributes.maxCuttingHeight",
                    parameterKey: "maxCuttingHeight",
                    options: [],
                    value: state.attributes?.booksCutting?.maxCuttingHeight ? state.attributes?.booksCutting?.maxCuttingHeight : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "maxBooksQuantity",
                    label: "machineAttributes.maxBooksQuantity",
                    type: "text",
                    placeholder: "machineAttributes.maxBooksQuantity",
                    parameterKey: "maxBooksQuantity",
                    options: [],
                    value: state.attributes?.booksCutting?.maxBooksQuantity ? state.attributes?.booksCutting?.maxBooksQuantity : '',
                },
            ]
        },
    ]
}

export {guillotineMachine};