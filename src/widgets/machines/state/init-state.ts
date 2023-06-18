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
            varnish: false,
            printLayers: false
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
    [ECategoryId.FOLDING_MACHINE]: {
        category: ECategoryId.FOLDING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            foldingConnect: {
                canConnect: false
            },
            scoringConnect: {
                canConnect: false

            }
        }
    },
    [ECategoryId.PASTING_BLOCKS_MACHINE]: {
        category: ECategoryId.PASTING_BLOCKS_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            mediaBaseType: 1,
            glueColors: 1
        }
    },
    [ECategoryId.SCORING_MACHINE]: {
        category: ECategoryId.SCORING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            foldingConnect: {
                canConnect: false
            },
            perforationConnect: {
                canConnect: false
            }
        }
    },
    [ECategoryId.PERFORATION_MACHINE]: {
        category: ECategoryId.SCORING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.FOLDING_GLUING_MACHINE]: {
        category: ECategoryId.FOLDING_GLUING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            speedMethod: 1
        }
    },
    [ECategoryId.DIGITAL_ENHANCEMENT_MACHINE]: {
        category: ECategoryId.DIGITAL_ENHANCEMENT_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            foilAvailable: false,
            foilOperationMode: 1,
            foilOptions: 1,
            embossingAvailable: false
        }
    },
    [ECategoryId.ANALOG_ENHANCEMENT_MACHINE]: {
        category: ECategoryId.ANALOG_ENHANCEMENT_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.ENCAPSULATION_MACHINE]: {
        category: ECategoryId.ENCAPSULATION_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.SIDE_COLORING]: {
        category: ECategoryId.SIDE_COLORING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            color: 1
        }
    },
    [ECategoryId.GUILLOTINE]: {
        category: ECategoryId.GUILLOTINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.FLATBED_CUTTING_MACHINE]: {
        category: ECategoryId.FLATBED_CUTTING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            feeder: false
        }
    },
    [ECategoryId.ROLL_FED_CUTTING_PLOTTERS]: {
        category: ECategoryId.ROLL_FED_CUTTING_PLOTTERS,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.STAPLER_MACHINE]: {
        category: ECategoryId.STAPLER_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            coilThickness: 1
        }
    },
    [ECategoryId.MANUAL_PEELING_STICKERS]: {
        category: ECategoryId.MANUAL_PEELING_STICKERS,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.PIERCING_MACHINE]: {
        category: ECategoryId.PIERCING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.FRAMING_IN_FIXED_FRAMES]: {
        category: ECategoryId.FRAMING_IN_FIXED_FRAMES,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.CUSTOM_FRAMING]: {
        category: ECategoryId.CUSTOM_FRAMING,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.LINKAGE]: {
        category: ECategoryId.LINKAGE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.PVC_BENDING_MACHINE]: {
        category: ECategoryId.PVC_BENDING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false
        }
    },
    [ECategoryId.COLLECTOR]: {
        category: ECategoryId.COLLECTOR,
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