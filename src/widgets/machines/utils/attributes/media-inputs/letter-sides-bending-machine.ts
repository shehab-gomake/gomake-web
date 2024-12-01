import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {mediaWidthSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-width-settings";

const letterSidesBendingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "mediaType",
            label: "machineAttributes.mediaType",
            type: "select",
            placeholder: "machineAttributes.mediaType",
            required: true,
            parameterKey: "mediaType",
            value: state?.attributes?.mediaType,
            options: [{value: 1, text: 'type 1'}, {value: 2, text: 'type 2'}],
            machineInputType: 'input',
            isValid: true,
        },
        ...mediaWidthSettings(state, EMeasurementUnits.CM),
        ...mediaThicknessSettings(state,EMeasurementUnits.MM),
    ]
}


export {letterSidesBendingMachine};