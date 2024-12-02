import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";
import {mediaDimensionsSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-dimensions-settings";
import {
    advertisingProductsCategories
} from "@/widgets/machines/utils/attributes/machine-material-categories/advertising-products-categories";

const pressMachine = (state: Record<string, any>) => {
    return [
        ...mediaSheetLossInput(state),
        ...mediaDimensionsSettings(state),
        ...advertisingProductsCategories(state)
    ]
}


export {pressMachine};