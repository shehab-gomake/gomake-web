import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const embroideryMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "setupTimePerSet",
            label: "machineAttributes.setupTimePerSet",
            type: "text",
            placeholder: "machineAttributes.setupTimePerSet",
            required: true,
            parameterKey: "setupTimePerSet",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state?.attributes?.setupTimePerSet ? state?.attributes?.setupTimePerSet : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimePerSet,
        },
        {
            name: "speedEmbroidery",
            label: "machineAttributes.speedEmbroidery",
            type: "text",
            placeholder: "machineAttributes.speedEmbroidery",
            required: true,
            parameterKey: "speedEmbroidery",
            unit: EMeasurementUnits.SQUARE_CM_HOUR,
            options: [],
            value: state?.attributes?.speedEmbroidery ? state?.attributes?.speedEmbroidery : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speedEmbroidery,
        },
        {
            name: 'machineAttributes.stationsAmountByAdvertisingProducts',
            parameterKey: 'stationsAmountByAdvertisingProducts',
            value: state.attributes?.stationsAmountByAdvertisingProducts || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "advertisingProducts",
                    label: "machineAttributes.advertisingProducts",
                    type: "select",
                    placeholder: "machineAttributes.advertisingProducts",
                    required: true,
                    parameterKey: "advertisingProducts",
                    options: []
                },
                {
                    name: "stations",
                    label: "machineAttributes.stations",
                    type: "text",
                    placeholder: "machineAttributes.stations",
                    required: true,
                    parameterKey: "stations",
                    options: []
                },
            ]
        },
    ]
}

export {embroideryMachine};