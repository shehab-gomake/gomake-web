import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {mediaWidthSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-width-settings";

const letterSidesBendingMachine = (state: Record<string, any>) => {
    return [
        // {
        //     name: "mediaType",
        //     label: "machineAttributes.mediaType",
        //     type: "select",
        //     placeholder: "machineAttributes.mediaType",
        //     required: true,
        //     parameterKey: "mediaType",
        //     value: state?.attributes?.mediaType,
        //     options: [],
        //     machineInputType: 'input',
        //     isValid: true,
        //     optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=lettersAndLightBoxSideRoll'
        // },
        ...mediaWidthSettings(state, EMeasurementUnits.CM),
        ...mediaThicknessSettings(state,EMeasurementUnits.MM),
    ]
}


export {letterSidesBendingMachine};