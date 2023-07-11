import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {
    marginWithoutPrintingSettings
} from "@/widgets/machines/utils/attributes/media-inputs/margin-without-printing-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {mediaCoatingSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-coating-settings";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.setupTime',
            parameterKey: 'setupTime',
            value: state.attributes?.setupTime || [],
            machineInputType: 'multiArrayInput',
            isValid: state.attributes?.setupTime?.length > 0,
            inputs: [
                {
                    name: "color",
                    label: "machineAttributes.upToMediaWeight",
                    type: "text",
                    placeholder: "machineAttributes.upToMediaWeight",
                    required: true,
                    parameterKey: "mediaWeight",
                    options: []
                },
                {
                    name: "time",
                    label: "machineAttributes.time",
                    type: "text",
                    placeholder: "machineAttributes.time",
                    required: true,
                    parameterKey: "time",
                    options: []
                },
                {
                    name: "sheetLost",
                    label: "machineAttributes.sheetsLost",
                    type: "text",
                    placeholder: "machineAttributes.sheetsLost",
                    required: true,
                    parameterKey: "sheetsLost",
                    options: []
                },
            ]
        },
        {
            name: "stationWashTime",
            label: "machineAttributes.stationWashTime",
            type: "text",
            placeholder: "machineAttributes.stationWashTime",
            required: true,
            parameterKey: "stationWashTime",
            options: [],
            value: state?.attributes?.stationWashTime ? state?.attributes?.stationWashTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.stationWashTime,
        },
        ...mediaCoatingSettings(state),
        ...mediaDimensionsSettings(state),
        ...marginWithoutPrintingSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state)
    ]
}


export {ofssetPrinting};