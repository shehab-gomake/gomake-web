import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaCoatingSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-coating-settings";
import {
    marginWithoutPrintingSettings
} from "@/widgets/machines/utils/attributes/media-inputs/margin-without-printing-settings";
import {mediaWeightSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-weight-settings";
import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {sheetsCategoriesList} from "@/widgets/machines/utils/attributes/media-inputs/sheets-categories-list";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        ...mediaCoatingSettings(state),
        {
            name: "sheetLost",
            label: "machineAttributes.mediaSheetsLoss",
            type: "text",
            placeholder: "machineAttributes.mediaSheetsLoss",
            required: true,
            parameterKey: "sheetsLoss",
            options: [],
            value: state?.sheetsLoss
        },
        ...mediaDimensionsSettings(state),
        ...marginWithoutPrintingSettings(state),
        ...mediaWeightSettings(state),
        ...mediaThicknessSettings(state,EMeasurementUnits.UM),
        ...sheetsCategoriesList(state),
        {
            name: 'machineAttributes.printOverLaminate',
            parameterKey: 'printOverLaminate',
            machineInputType: 'multiInput',
            value: state.attributes?.printOverLaminate ? state.attributes?.printOverLaminate : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.available",
                    type: "switch",
                    placeholder: "machineAttributes.available",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.printOverLaminate?.isAvailable ? state.attributes?.printOverLaminate?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.colorOption",
                    type: "select",
                    placeholder: "machineAttributes.colorOption",
                    required: true,
                    parameterKey: "colorOption",
                    options: [{value: '1', text: 'machineAttributes.foilOverlayColor' }, {value: '2', text: 'machineAttributes.scratchOfOverLayColor' }],
                    value: state?.attributes?.printOverLaminate?.colorOption,
                    multiple: true,
                    disabled: !state.attributes?.printOverLaminate?.isAvailable
                },
            ]
        },
    ]
}


export {digitalPrinting};