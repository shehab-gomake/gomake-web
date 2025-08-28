export type Step =
  | { type: "methods" }
  | { type: "finishing-digital-offset" }
  | { type: "book-finishing" }
  | { type: "material-digital-offset" }
  | { type: "finishing-roll" }
  | { type: "material-roll" }
  | { type: "finishing-wide" }
  | { type: "material-wide" }
  | { type: "finishing-dtf" }
  | { type: "packing" }
  | { type: "summary" };

export interface SetupStepConfig {
  type: Step["type"];
  label: string;
  dependsOn?: string[]; // Which selectedMethods must be selected
  filter?: {
    condition: (selectedMethods: string[]) => boolean;
    exclude: string[];
  };
  options?: string[];
}

// Printing Methods
export const printingMethods = [
  "digital_printing",
  "offset_printing",
  "roll_digital_printing",
  "roll_offset_printing",
  "flexo_printing",
  "wide_printer",
  "dtf_sublimation",
];

// Actions for each category

// Digital Printing / Offset printing
export const finishingActionsDigitalOffset = [
  "cnc_digital_diecut",
  "guillotine",
  "diecut_analog",
  "punching_drilling",
  "rounding_corners",
  "folding",
  "pasting_blocks",
  "scoring_and_perforation",
  "folding_and_gluing",
  "digital_foil",
  "foil_embossing_stamp",
  "digital_selective_lamination",
  "encapsulation",
  "manual_sewing",
  "side_coloring",
  "card_cutting",
  "embroidery",
  "cartoon_cups",
  "linkage",
  "plate_processor",
];

export const bookFinishingActions = [
  "booklet",
  "perfect_binding",
  "books_sewing",
  "spiral",
  "manual_stapler",
  "hardcover_cover",
  "three_knife_trimmer",
  "collector",
];

// Roll digital printing / Roll offset printing /Flexo printing
export const finishingActionsRollPrinting = [
  "cnc",
  "die_cut",
  "lamination",
  "varnish",
  "embossing",
  "selective",
  "roll_sheeter",
];

// Wide printer
export const finishingActionsWidePrinter = [
  "cnc",
  "manual_cutting",
  "stickers_peeling",
  "ring_eyelet_punching",
  "linkage",
  "pvc_bending",
  "letter_sides_bending",
  "light_boxes_and_letter_assembly",
  "cold_lamination",
];

// DTF & Sublimation
export const finishingActionsDTF = [
  "silk_mesh_processor",
  "silk_printer",
  "press_machine",
];

// Packing Methods
export const packingMethods = [
  "shrink_packaging",
  "tying_packaging",
  "cartoon_packaging",
];

//!here
export const getSetupStepsConfig = (isUs: boolean): SetupStepConfig[] => [
  {
    type: "methods",
    label: "select_printing_methods",
    options: printingMethods,
  },
  {
    type: "finishing-digital-offset",
    label: "select_finishing_actions_digital_offset",
    dependsOn: ["digital_printing", "offset_printing"],
    options: finishingActionsDigitalOffset,
    filter: {
      condition: (selected) => !selected.includes("offset_printing"),
      exclude: ["plate_processor"],
    },
  },
  {
    type: "book-finishing",
    label: "select_book_finishing_actions",
    dependsOn: ["digital_printing", "offset_printing"],
    options: bookFinishingActions,
  },
  {
    type: "material-digital-offset",
    label: "select_paper_sheets_sizes_digital_offset",
    dependsOn: ["digital_printing", "offset_printing"],
    options: isUs
      ? ["12x18", "20813x295", "295x41626"]
      : ["33x488", "50x70", "70x100"],
  },
  {
    type: "finishing-roll",
    label: "select_roll_finishing_actions",
    dependsOn: [
      "roll_digital_printing",
      "roll_offset_printing",
      "flexo_printing",
    ],
    options: finishingActionsRollPrinting,
  },
  {
    type: "material-roll",
    label: "enter_max_roll_width",
    dependsOn: [
      "roll_digital_printing",
      "roll_offset_printing",
      "flexo_printing",
    ],
  },
  {
    type: "finishing-wide",
    label: "select_wide_printer_actions",
    dependsOn: ["wide_printer"],
    options: finishingActionsWidePrinter,
  },
  {
    type: "material-wide",
    label: "select_wide_printer_materials_and_size",
    dependsOn: ["wide_printer"],
    options: [
      "kappa",
      "aluminum_bond",
      "magnet",
      "pvc",
      "perspex",
      "banner",
      "vinyl",
      "synthetic_paper",
    ],
  },
  {
    type: "finishing-dtf",
    label: "select_dtf_sublimation_actions",
    dependsOn: ["dtf_sublimation"],
    options: finishingActionsDTF,
  },
  {
    type: "packing",
    label: "select_packing_methods",
    options: packingMethods,
  },
  {
    type: "summary",
    label: "review_summary",
  },
];
