import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {mediaFlatbedCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-flatbed-categories";
import {mediaSheetsCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-sheets-categories";

const guillotineMachine = (state: Record<string, any>) => {
    return [
        ...mediaDimensionsSettings(state),
        ...mediaSheetsCategories(state),
        ...mediaFlatbedCategories(state),
    ]
}


export {guillotineMachine};