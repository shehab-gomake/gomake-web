import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";

const piercingMachine = (state: Record<string, any>) => {
    return [
        ...mediaThicknessSettings(state),
    ]
}


export {piercingMachine};