import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {printingGeneral} from "@/widgets/machines/utils/attributes/speed-inputs/printing-general";

const rollDigitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state.attributes?.setupTimeMin ? state.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            unit: EMeasurementUnits.METER_P_MIN,
            parameterKey: "maxSpeed",
            options: [],
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        ...printingGeneral(state)
    ]
}

export {rollDigitalPrinting};