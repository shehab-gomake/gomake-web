import {ECategoryId} from "@/widgets/machines/enums/category-id";

const initState: Record<string, Record<string, any>> = {
    [ECategoryId.DIGITAL_PRINTING]: {
        category: ECategoryId.DIGITAL_PRINTING,
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
            varnish: false,
            loadingWhileRunning: false,
            bookletConnection: {
                canConnect: false,
                machine: ''
            },
            BoosbinderConnection: {
                canConnect: false,
                machine: ''
            },
            sewingConnection: {
                canConnect: false,
                machine: ''
            },
        }
    },
    [ECategoryId.BOOKLET_MACHINE]: {
        category: ECategoryId.BOOKLET_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            resolution: 0,
            doubleHead: false,
            coatingUnit: false,
            basicsColors: 1,
            varnish: false,
            feedOption: 0,
            collectionConnection: {
                canConnect: false,
                machine: ''
            },
            printingMachineConnection: {
                canConnect: false,
                machine: ''
            },
            cuttingUpDown: false,
            cuttingSide: false,
            squareBackSpaneOption: false
        }
    },
    [ECategoryId.BOOKS_BINDER_MACHINE]: {
        category: ECategoryId.BOOKS_BINDER_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            feedOption: 0,
            paperCategoriesSuitable: 0,
            collectionConnection: {
                canConnect: false,
                machine: ''
            },
            printingMachineConnection: {
                canConnect: false,
                machine: ''
            },
            glueType: 0,
            addonsBookmark: false,
            addonsCapital: false
        }
    },
    [ECategoryId.BOOKS_SEWING_MACHINE]: {
        category: ECategoryId.BOOKS_SEWING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            collectionConnection: {
                canConnect: false,
                machine: ''
            }
        }
    },
    [ECategoryId.SPIRAL_CLOSING_MACHINE]: {
        category: ECategoryId.SPIRAL_CLOSING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            actionType: 0,
            collectionConnection: {
                canConnect: false,
                machine: ''
            }
        }
    },
    [ECategoryId.SPIRAL_PERFORATION_MACHINE]: {
        category: ECategoryId.SPIRAL_PERFORATION_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {
            autoActionFeederType: {
                loadingWhileRunning: false
            },
            autoActionStackerType: {
                loadingWhileRunning: false
            },
            collectionConnection: {
                canConnect: false,
                machine: ''
            }
        }
    },
    [ECategoryId.BOOK_CASING_IN_MACHINE]: {
        category: ECategoryId.BOOK_CASING_IN_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.HARD_COVER_MAKING_MACHINE]: {
        category: ECategoryId.HARD_COVER_MAKING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.GLUING_MACHINE]: {
        category: ECategoryId.GLUING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.PRESSING_MACHINE]: {
        category: ECategoryId.PRESSING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.SHRINK_PACKING_MACHINE]: {
        category: ECategoryId.SHRINK_PACKING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.PACKAGE_TYING_MACHINE]: {
        category: ECategoryId.PACKAGE_TYING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.CARTOON_PACKAGING_MACHINE]: {
        category: ECategoryId.CARTOON_PACKAGING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.MANUAL_SEWING_MACHINE]: {
        category: ECategoryId.MANUAL_SEWING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.ROLL_FINISH_MACHINE]: {
        category: ECategoryId.ROLL_FINISH_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.ROLL_LAMINATION_MACHINE]: {
        category: ECategoryId.ROLL_LAMINATION_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.ROLL_DIE_CUT_MACHINE]: {
        category: ECategoryId.ROLL_DIE_CUT_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.ROLL_SHEET_MACHINE]: {
        category: ECategoryId.ROLL_SHEET_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.ROLL_VARNISH_MACHINE]: {
        category: ECategoryId.ROLL_VARNISH_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.ROLL_ANALOG_ENHANCEMENT_MACHINE]: {
        category: ECategoryId.ROLL_ANALOG_ENHANCEMENT_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.AUTO_BOOK_CUTTING_MACHINE]: {
        category: ECategoryId.AUTO_BOOK_CUTTING_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE]: {
        category: ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.CREATING_DIES_MACHINE]: {
        category: ECategoryId.CREATING_DIES_MACHINE,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.MESH_PROCESSORS]: {
        category: ECategoryId.MESH_PROCESSORS,
        price: {price: 0, currency: 0},
        attributes: {}
    },
    [ECategoryId.SILK_PRINTER]: {
        category: ECategoryId.SILK_PRINTER,
        price: {price: 0, currency: 0},
        attributes: {}
    },
}
export {initState};