import {ECategoryId} from "@/widgets/machines/enums/category-id";

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
    [ECategoryId.OFSSET_PRINTING]: {
        category:ECategoryId.OFSSET_PRINTING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.ROLL_DIGITAL_PRINTING]: {
        category:ECategoryId.ROLL_DIGITAL_PRINTING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        },
    },
    [ECategoryId.FLEXO_PRINTING]: {
        category: ECategoryId.FLEXO_PRINTING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.ROLL_WIDE_PRINTING]: {
        category: ECategoryId.ROLL_WIDE_PRINTING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.FLATBED_WIDE_PRINTING]: {
        category: ECategoryId.FLATBED_WIDE_PRINTING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.LAMINATION_MACHINE]: {
        category: ECategoryId.LAMINATION_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.PUNCHING_MACHINE]: {
        category: ECategoryId.PUNCHING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.ROUNDING_CORNERS_MACHINE]: {
        category: ECategoryId.ROUNDING_CORNERS_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
}
export {initState};