import {mediaSheetsCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-sheets-categories";
import {mediaWideFormatCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-wide-format-categories";
import {mediaFlatbedCategories} from "@/widgets/machines/utils/attributes/media-inputs/media-flatbed-categories";

const materialCategories  = (state, unitName: string) => {
    return [
        ...mediaSheetsCategories(state, unitName + 'SheetsCategories'),
        ...mediaWideFormatCategories(state, unitName + 'WideFormatCategories'),
        ...mediaFlatbedCategories(state, unitName + 'FlatBedCategories'),
    ]
};

export {materialCategories}