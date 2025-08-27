import { FinishingCategory } from "@/widgets/quick-setup/on-boarding-setup/types";
import { ECategoryId } from "@/widgets/machines/enums/category-id";

// Digital/Offset Finishing Categories Configuration
export const initializeFinishingCategories = (): FinishingCategory[] => [
  {
    id: ECategoryId.FLATBED_CUTTING_MACHINE,
    name: "machinesCategories.flatbedCutting",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.GUILLOTINE,
    name: "machinesCategories.guillottine",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.ROLL_FED_CUTTING_PLOTTERS,
    name: "machinesCategories.rollFedCutting",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.PUNCHING_MACHINE,
    name: "machinesCategories.punching",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.ROUNDING_CORNERS_MACHINE,
    name: "machinesCategories.roundingCorners",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.FOLDING_MACHINE,
    name: "machinesCategories.folding",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.PASTING_BLOCKS_MACHINE,
    name: "machinesCategories.pastingBlocks",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.SCORING_MACHINE,
    name: "machinesCategories.scoring",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.FOLDING_GLUING_MACHINE,
    name: "machinesCategories.foldingGluing",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.DIGITAL_ENHANCEMENT_MACHINE,
    name: "machinesCategories.digitalEnhancement",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.ANALOG_ENHANCEMENT_MACHINE,
    name: "machinesCategories.analogEnhancement",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.LAMINATION_MACHINE,
    name: "machinesCategories.lamination",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.ENCAPSULATION_MACHINE,
    name: "machinesCategories.encapsulation",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.MANUAL_SEWING_MACHINE,
    name: "machinesCategories.manualSewing",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.CARD_CUTTING,
    name: "machinesCategories.cardCutting",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.EMBROIDERY_MACHINE,
    name: "machinesCategories.embroideryMachine",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.CARTOON_CUPS,
    name: "machinesCategories.cartoonCups",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.LINKAGE,
    name: "machinesCategories.linkage",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.CARTOON_PACKAGING_MACHINE,
    name: "machinesCategories.cartoonPackaging",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.PACKAGE_TYING_MACHINE,
    name: "machinesCategories.packageTying",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.SHRINK_PACKING_MACHINE,
    name: "machinesCategories.shrinkPackaging",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: ECategoryId.THERMAL_PLATE_PROCESSOR,
    name: "machinesCategories.thermalPlateProcessor",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
];

// Book Finishing Categories Configuration
export const initializeBookFinishingCategories = (): FinishingCategory[] => [
  {
    id: ECategoryId.BOOKLET_MACHINE,
    name: "machinesCategories.booklet",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.BOOKS_BINDER_MACHINE,
    name: "machinesCategories.booksBinder",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.BOOKS_SEWING_MACHINE,
    name: "machinesCategories.booksSewing",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.SPIRAL_CLOSING_MACHINE,
    name: "machinesCategories.spiralClosing",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.STAPLER_MACHINE,
    name: "machinesCategories.stapler",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.HARD_COVER_MAKING_MACHINE,
    name: "machinesCategories.hardCover",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.AUTO_BOOK_CUTTING_MACHINE,
    name: "machinesCategories.autoBookCutting",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
  {
    id: ECategoryId.COLLECTOR,
    name: "machinesCategories.collector",
    machines: [], // Will be populated from API
    categoryType: "book_finishing",
  },
];

// Wide Format Finishing Categories Configuration
export const initializeWideFormatFinishingCategories =
  (): FinishingCategory[] => [
    {
      id: ECategoryId.FLATBED_CUTTING_MACHINE,
      name: "machinesCategories.flatbedCutting",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.ROLL_FED_CUTTING_PLOTTERS,
      name: "machinesCategories.rollFedCutting",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.MANUAL_PEELING_STICKERS,
      name: "machinesCategories.manualPeelingStickers",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.PIERCING_MACHINE,
      name: "machinesCategories.piercingMachine",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.LINKAGE,
      name: "machinesCategories.linkage",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.PVC_BENDING_MACHINE,
      name: "machinesCategories.PVCBending",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.LETTER_SIDES_BENDING_MACHINE,
      name: "machinesCategories.letterSidesBendingMachine",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.LIGHT_BOXES_LETTER_ASSEMBLY,
      name: "machinesCategories.lightBoxesLetterAssembly",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.LAMINATION_MACHINE,
      name: "machinesCategories.lamination",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.CARTOON_PACKAGING_MACHINE,
      name: "machinesCategories.cartoonPackaging",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.PACKAGE_TYING_MACHINE,
      name: "machinesCategories.packageTying",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
    {
      id: ECategoryId.SHRINK_PACKING_MACHINE,
      name: "machinesCategories.shrinkPackaging",
      machines: [], // Will be populated from API
      categoryType: "wide_format",
    },
  ];

// DTF & Sublimation Finishing Categories Configuration
export const initializeDtfSublimationFinishingCategories =
  (): FinishingCategory[] => [
    {
      id: ECategoryId.MESH_PROCESSORS,
      name: "machinesCategories.meshProcessorsMachine",
      machines: [], // Will be populated from API
      categoryType: "dtf_sublimation",
    },
    {
      id: ECategoryId.SILK_PRINTER,
      name: "machinesCategories.silkPrinter",
      machines: [], // Will be populated from API
      categoryType: "dtf_sublimation",
    },
    {
      id: ECategoryId.PRESS_MACHINE,
      name: "machinesCategories.pressMachine",
      machines: [], // Will be populated from API
      categoryType: "dtf_sublimation",
    },
    {
      id: ECategoryId.CARTOON_PACKAGING_MACHINE,
      name: "machinesCategories.cartoonPackaging",
      machines: [], // Will be populated from API
      categoryType: "dtf_sublimation",
    },
    {
      id: ECategoryId.PACKAGE_TYING_MACHINE,
      name: "machinesCategories.packageTying",
      machines: [], // Will be populated from API
      categoryType: "dtf_sublimation",
    },
    {
      id: ECategoryId.SHRINK_PACKING_MACHINE,
      name: "machinesCategories.shrinkPackaging",
      machines: [], // Will be populated from API
      categoryType: "dtf_sublimation",
    },
  ];

// Roll/Flexo Finishing Categories Configuration
export const initializeRollFlexoFinishingCategories =
  (): FinishingCategory[] => [
    {
      id: ECategoryId.FLATBED_CUTTING_MACHINE,
      name: "machinesCategories.flatbedCutting",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.ROLL_DIE_CUT_MACHINE,
      name: "machinesCategories.creatingDiesMachine",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.ROLL_LAMINATION_MACHINE,
      name: "machinesCategories.lamination",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.ROLL_VARNISH_MACHINE,
      name: "machinesCategories.uvCoatingVarnishMachine",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.ROLL_DIGITAL_ENHANCEMENT_MACHINE,
      name: "machinesCategories.rollDigitalEnhancement",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.UV_COATING_VARNISH_MACHINE,
      name: "machinesCategories.uvCoatingVarnishMachine",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.ROLL_SHEET_MACHINE,
      name: "machinesCategories.rollSheeter",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.CARTOON_PACKAGING_MACHINE,
      name: "machinesCategories.cartoonPackaging",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.PACKAGE_TYING_MACHINE,
      name: "machinesCategories.packageTying",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: ECategoryId.SHRINK_PACKING_MACHINE,
      name: "machinesCategories.shrinkPackaging",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
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
