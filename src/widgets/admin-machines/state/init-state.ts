import {ECategoryId} from "@/widgets/admin-machines/enums/category-id";

const initState: Record<string, Record<string, any>> = {
    [ECategoryId.DIGITAL_PRINTING]: {
        category: ECategoryId.DIGITAL_PRINTING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            printLayers: false,
            printLayersSameRun: false,
            basicsColors: 1,
            coatingUnit: false
        }
    },
    [ECategoryId.CATEGORY2]: {
        category:ECategoryId.CATEGORY2,
        price: {price: 0, currency: 0},
        attributes: {}
    }
}
export {initState};