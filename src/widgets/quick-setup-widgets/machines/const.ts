import {ECategoryId} from "@/widgets/machines/enums/category-id";

export type MachinesTypes =
    'printers'
    | 'cutting'
    | 'packaging'
    | 'sheets-finish'
    | 'books-finish'
    | 'wide-printing-finish'
    | 'roll-finish'
    | 'silk-finish';
export const machinesTypeCategories = (machinesType: MachinesTypes): { categories: ECategoryId[], required: boolean, next: string } => {
    switch (machinesType) {
        case "printers":
            return {
                required: true,
                next: '/quick-setup/machines/cutting',
                categories: [
                    ECategoryId.DIGITAL_PRINTING,
                    ECategoryId.OFSSET_PRINTING,
                    ECategoryId.ROLL_DIGITAL_PRINTING,
                    ECategoryId.FLEXO_PRINTING,
                    ECategoryId.ROLL_WIDE_PRINTING,
                    ECategoryId.SILK_PRINTER
                ],
            }
        case "cutting":
            return {
                required: true,
                next: '/quick-setup/machines/packaging',
                categories: [
                    ECategoryId.GLUING_MACHINE,
                    ECategoryId.FLATBED_CUTTING_MACHINE,
                    ECategoryId.ANALOG_ENHANCEMENT_MACHINE,
                    ECategoryId.AUTO_BOOK_CUTTING_MACHINE
                ],
            }
        case "packaging":
            return {
                required: true,
                next: '/quick-setup/machines/sheets-finish',
                categories: [
                    ECategoryId.SHRINK_PACKING_MACHINE,
                    ECategoryId.PACKAGE_TYING_MACHINE,
                    ECategoryId.CARTOON_PACKAGING_MACHINE
                ],
            };
        case "sheets-finish":
            return {
                required: false,
                next: '/quick-setup/machines/books-finish',
                categories: [
                    ECategoryId.LAMINATION_MACHINE,
                    ECategoryId.PUNCHING_MACHINE,
                    ECategoryId.ROUNDING_CORNERS_MACHINE,
                    ECategoryId.FOLDING_MACHINE,
                    ECategoryId.SCORING_MACHINE,
                    ECategoryId.FOLDING_GLUING_MACHINE,
                    ECategoryId.DIGITAL_ENHANCEMENT_MACHINE,
                    ECategoryId.ENCAPSULATION_MACHINE,
                    ECategoryId.SIDE_COLORING,
                    ECategoryId.MANUAL_PEELING_STICKERS,
                    ECategoryId.PRESSING_MACHINE,
                    ECategoryId.LINKAGE,
                    ECategoryId.THERMAL_PLATE_PROCESSOR,
                    ECategoryId.COLLECTOR
                ],
            };
        case "books-finish":
            return {
                required: false,
                next: '/quick-setup/machines/wide-printing-finish',
                categories: [
                    ECategoryId.STAPLER_MACHINE,
                    ECategoryId.PASTING_BLOCKS_MACHINE,
                    ECategoryId.BOOKLET_MACHINE,
                    ECategoryId.BOOKS_BINDER_MACHINE,
                    ECategoryId.BOOKS_SEWING_MACHINE,
                    ECategoryId.SPIRAL_CLOSING_MACHINE,
                    ECategoryId.SPIRAL_PERFORATION_MACHINE,
                    ECategoryId.HARD_COVER_MAKING_MACHINE,
                    ECategoryId.BOOK_CASING_IN_MACHINE,
                    ECategoryId.PRESSING_MACHINE,
                    ECategoryId.MANUAL_SEWING_MACHINE,
                    ECategoryId.COLLECTOR
                ],
            }
        case "wide-printing-finish":
            return {
                required: false,
                next: '/quick-setup/machines/roll-finish',
                categories: [
                    ECategoryId.PUNCHING_MACHINE,
                    ECategoryId.ROLL_FED_CUTTING_PLOTTERS,
                    ECategoryId.MANUAL_PEELING_STICKERS,
                    ECategoryId.PIERCING_MACHINE,
                    ECategoryId.LINKAGE
                ],
            };
        case "roll-finish":
            return {
                required: false,
                next: '/quick-setup/machines/silk-finish',
                categories: [
                    ECategoryId.ROLL_FED_CUTTING_PLOTTERS,
                    ECategoryId.ROLL_FINISH_MACHINE,
                    ECategoryId.ROLL_SHEET_MACHINE,
                    ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE
                ],
            };
        case "silk-finish":
            return {
                required: false,
                next: '/quick-setup/materials',
                categories: [ECategoryId.MESH_PROCESSORS]
            }
        default :
            return {
                required: false,
                next: '/quick-setup/machines/printers',
                categories: []
            }
    }
}