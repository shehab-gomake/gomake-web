import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const letterSidesBendingMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            unit: EMeasurementUnits.METER_PER_HOUR,
            parameterKey: "speed",
            options: [],
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
        },
        {
            name: "setupTimePerLetterLightBox",
            label: "machineAttributes.setupTimePerLetterLightBox",
            type: "text",
            placeholder: "machineAttributes.setupTimePerLetterLightBox",
            required: true,
            unit: EMeasurementUnits.SECOND,
            parameterKey: "setupTimePerLetterLightBox",
            options: [],
            value: state.attributes?.setupTimePerLetterLightBox ? state.attributes?.setupTimePerLetterLightBox : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimePerLetterLightBox,
        },
    ]
}

export {letterSidesBendingMachine};

