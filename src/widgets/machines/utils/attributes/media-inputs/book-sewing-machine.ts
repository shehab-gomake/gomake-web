import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";

const bookSewingMachine = (state: Record<string, any>) => {
    return [
        ...mediaThicknessSettings(state),
        ...mediaDimensionsSettings(state),
    ]
}


export {bookSewingMachine};