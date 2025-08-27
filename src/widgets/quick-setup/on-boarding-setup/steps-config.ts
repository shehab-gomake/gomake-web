import { FinishingCategory } from "@/widgets/quick-setup/on-boarding-setup/types";
import { ECategoryId } from "@/widgets/machines/enums/category-id";

// Digital/Offset Finishing Categories Configuration
export const initializeFinishingCategories = (): FinishingCategory[] => [
  {
    id: ECategoryId.FLATBED_CUTTING_MACHINE,
    name: "machinesCategories.flatbedCutting",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.GUILLOTINE,
    name: "machinesCategories.guillottine",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.PUNCHING_MACHINE,
    name: "machinesCategories.punching",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.ROUNDING_CORNERS_MACHINE,
    name: "machinesCategories.roundingCorners",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.FOLDING_MACHINE,
    name: "machinesCategories.folding",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.PASTING_BLOCKS_MACHINE,
    name: "machinesCategories.pastingBlocks",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.SCORING_MACHINE,
    name: "machinesCategories.scoring",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.FOLDING_GLUING_MACHINE,
    name: "machinesCategories.foldingGluing",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.DIGITAL_ENHANCEMENT_MACHINE,
    name: "machinesCategories.digitalEnhancement",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.LAMINATION_MACHINE,
    name: "machinesCategories.lamination",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.ENCAPSULATION_MACHINE,
    name: "machinesCategories.encapsulation",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.MANUAL_SEWING_MACHINE,
    name: "machinesCategories.manualSewing",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.CARD_CUTTING,
    name: "machinesCategories.cardCutting",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.EMBROIDERY_MACHINE,
    name: "machinesCategories.embroideryMachine",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.CARTOON_CUPS,
    name: "machinesCategories.cartoonCups",
    machines: [],
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.LINKAGE,
    name: "machinesCategories.linkage",
    machines: [],
    categoryType: "digital_offset",
  },
  // {
  //   id: ECategoryId.CARTOON_PACKAGING_MACHINE,
  //   name: "machinesCategories.cartoonPackaging",
  //   machines: [],
  //   categoryType: "digital_offset",
  // },
  // {
  //   id: ECategoryId.PACKAGE_TYING_MACHINE,
  //   name: "machinesCategories.packageTying",
  //   machines: [],
  //   categoryType: "digital_offset",
  // },
  // {
  //   id: ECategoryId.SHRINK_PACKING_MACHINE,
  //   name: "machinesCategories.shrinkPackaging",
  //   machines: [],
  //   categoryType: "digital_offset",
  // },
  //!here only for
  {
    id: ECategoryId.THERMAL_PLATE_PROCESSOR,
    name: "machinesCategories.thermalPlateProcessor",
    machines: [],
    categoryType: "digital_offset",
  },
];

// Book Finishing Categories Configuration
export const initializeBookFinishingCategories = (): FinishingCategory[] => [
  {
    id: ECategoryId.BOOKLET_MACHINE,
    name: "machinesCategories.booklet",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.BOOKS_BINDER_MACHINE,
    name: "machinesCategories.booksBinder",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.BOOKS_SEWING_MACHINE,
    name: "machinesCategories.booksSewing",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.SPIRAL_CLOSING_MACHINE,
    name: "machinesCategories.spiralClosing",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.SPIRAL_PERFORATION_MACHINE,
    name: "machinesCategories.spiralPerforation",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.STAPLER_MACHINE,
    name: "machinesCategories.stapler",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.BOOK_CASING_IN_MACHINE,
    name: "machinesCategories.bookCasingIn",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.BOOK_PRESSING_MACHINE,
    name: "machinesCategories.pressing",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.HARD_COVER_MAKING_MACHINE,
    name: "machinesCategories.hardCover",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.AUTO_BOOK_CUTTING_MACHINE,
    name: "machinesCategories.autoBookCutting",
    machines: [],
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.COLLECTOR,
    name: "machinesCategories.collector",
    machines: [],
    categoryType: "book_finishing",
  },
];

// Roll/Flexo Finishing Categories Configuration
export const initializeRollFlexoFinishingCategories =
  (): FinishingCategory[] => [
    {
      id: ECategoryId.FLATBED_CUTTING_MACHINE,
      name: "machinesCategories.flatbedCutting",
      machines: [],
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.ROLL_FINISH_MACHINE,
      name: "machinesCategories.rollFinishMachine",
      machines: [],
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.ROLL_SHEET_MACHINE,
      name: "machinesCategories.rollSheeter",
      machines: [],
      categoryType: "roll_flexo",
    },
    // {
    //   id: ECategoryId.CARTOON_PACKAGING_MACHINE,
    //   name: "machinesCategories.cartoonPackaging",
    //   machines: [],
    //   categoryType: "roll_flexo",
    // },
    // {
    //   id: ECategoryId.PACKAGE_TYING_MACHINE,
    //   name: "machinesCategories.packageTying",
    //   machines: [],
    //   categoryType: "roll_flexo",
    // },
    // {
    //   id: ECategoryId.SHRINK_PACKING_MACHINE,
    //   name: "machinesCategories.shrinkPackaging",
    //   machines: [],
    //   categoryType: "roll_flexo",
    // },
  ];

// Wide Format Finishing Categories Configuration
export const initializeWideFormatFinishingCategories =
  (): FinishingCategory[] => [
    {
      id: ECategoryId.FLATBED_CUTTING_MACHINE,
      name: "machinesCategories.flatbedCutting",
      machines: [],
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.MANUAL_PEELING_STICKERS,
      name: "machinesCategories.manualPeelingStickers",
      machines: [],
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.PIERCING_MACHINE,
      name: "machinesCategories.piercingMachine",
      machines: [],
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.LINKAGE,
      name: "machinesCategories.linkage",
      machines: [],
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.PVC_BENDING_MACHINE,
      name: "machinesCategories.PVCBending",
      machines: [],
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.LETTER_SIDES_BENDING_MACHINE,
      name: "machinesCategories.letterSidesBendingMachine",
      machines: [],
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.LIGHT_BOXES_LETTER_ASSEMBLY,
      name: "machinesCategories.lightBoxesLetterAssembly",
      machines: [],
      categoryType: "wide_format",
    },
    // {
    //   id: ECategoryId.CARTOON_PACKAGING_MACHINE,
    //   name: "machinesCategories.cartoonPackaging",
    //   machines: [],
    //   categoryType: "wide_format",
    // },
    // {
    //   id: ECategoryId.PACKAGE_TYING_MACHINE,
    //   name: "machinesCategories.packageTying",
    //   machines: [],
    //   categoryType: "wide_format",
    // },
    // {
    //   id: ECategoryId.SHRINK_PACKING_MACHINE,
    //   name: "machinesCategories.shrinkPackaging",
    //   machines: [],
    //   categoryType: "wide_format",
    // },
  ];

// DTF & Sublimation Finishing Categories Configuration
export const initializeDtfSublimationFinishingCategories =
  (): FinishingCategory[] => [
    {
      id: ECategoryId.MESH_PROCESSORS,
      name: "machinesCategories.meshProcessorsMachine",
      machines: [],
      categoryType: "dtf_sublimation",
    },
    {
      id: ECategoryId.SILK_PRINTER,
      name: "machinesCategories.silkPrinter",
      machines: [],
      categoryType: "dtf_sublimation",
    },
    {
      id: ECategoryId.PRESS_MACHINE,
      name: "machinesCategories.pressMachine",
      machines: [],
      categoryType: "dtf_sublimation",
    },
    // {
    //   id: ECategoryId.CARTOON_PACKAGING_MACHINE,
    //   name: "machinesCategories.cartoonPackaging",
    //   machines: [],
    //   categoryType: "dtf_sublimation",
    // },
    // {
    //   id: ECategoryId.PACKAGE_TYING_MACHINE,
    //   name: "machinesCategories.packageTying",
    //   machines: [],
    //   categoryType: "dtf_sublimation",
    // },
    // {
    //   id: ECategoryId.SHRINK_PACKING_MACHINE,
    //   name: "machinesCategories.shrinkPackaging",
    //   machines: [],
    //   categoryType: "dtf_sublimation",
    // },
  ];

// Step configuration
export const STEPS_CONFIG = {
  steps: [
    "Select Machines",
    "Select Sheet Digital/Offset  Finishing",
    "Select Sheet Digital/Offset Book  Finishing",
    "Select Roll/Flexo Finishing",
    "Select Wide Format Finishing",
    "Select DTF & Sublimation Finishing",
  ],
  stepDescriptions: {
    0: "Select your printing machines from any category",
    1: "Configure finishing machines for Digital/Offset printing",
    2: "Based on your selected Digital/Offset printing machines, configure the book finishing machines for each category below.",
    3: "Configure finishing machines for Roll/Flexo printing",
    4: "Based on your selected Wide printer machines, configure the Wide format finishing machines for each category below.",
    5: "Based on your selected DTF & Sublimation machines, configure the Wide format finishing machines for each category below.",
  },
};
