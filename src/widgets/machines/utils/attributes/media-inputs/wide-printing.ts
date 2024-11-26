import {flatbedWidePrinting} from "@/widgets/machines/utils/attributes/media-inputs/flatbed-wide-printing";
import {mediaSheetsCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-sheets-categories";
import {mediaWideFormatCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-wide-format-categories";
import {mediaFlatbedCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-flatbed-categories";

const widePrinting = (state: Record<string, any>) => {
    return [
        ...flatbedWidePrinting(state),
        ...mediaSheetsCategories(state),
        ...mediaWideFormatCategories(state),
        ...mediaFlatbedCategories(state),
    ]
}


export {widePrinting};