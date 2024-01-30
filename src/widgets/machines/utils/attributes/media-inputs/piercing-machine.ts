import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const piercingMachine = (state: Record<string, any>) => {
    return [
        ...mediaThicknessSettings(state,EMeasurementUnits.UM),
    ]
}


export {piercingMachine};