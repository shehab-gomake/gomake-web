import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

import {
    mediaAdvertisingProductsCategories
} from "@/widgets/machines/utils/attributes/media-inputs/media-advertising-products-categories";

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
            name: "stationsAmount",
            label: "machineAttributes.stationsAmount",
            type: "text",
            placeholder: "machineAttributes.stationsAmount",
            required: true,
            parameterKey: "stationsAmount",
            options: [],
            value: state?.attributes?.speedEmbroidery ? state?.attributes?.speedEmbroidery : '',
            machineInputType: 'input',
        },
        ...mediaAdvertisingProductsCategories(state)
    ]
}

export {embroideryMachine};