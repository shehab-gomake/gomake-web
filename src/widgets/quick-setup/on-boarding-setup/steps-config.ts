import { FinishingCategory } from "@/widgets/quick-setup/on-boarding-setup/types";

// Digital/Offset Finishing Categories Configuration
export const initializeFinishingCategories = (): FinishingCategory[] => [
  {
    id: "cnc_digital_diecut",
    name: "CNC",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "guillotine",
    name: "Guillotine",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "diecut_analog",
    name: "Diecut analog",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "punching_drilling",
    name: "Punching/Driling",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "rounding_corners",
    name: "Rounding corners",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "folding",
    name: "Folding",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "pasting_blocks",
    name: "Pasting Blocks",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "scoring_and_perforation",
    name: "Scoring & Perforation",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "folding_and_gluing",
    name: "Folding and gluining",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "digital_foil",
    name: "Digital Foil",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "foil_embossing_stamp",
    name: "Foil/Embossing stamp",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "digital_selective_lamination",
    name: "Digital Selective Lamination",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "encapsulation",
    name: "Encapsulation",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "manual_sewing",
    name: "Manual Sewing",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "card_cutting",
    name: "Card cutting",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "embroidery",
    name: "Embroidery",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "cartoon_cups",
    name: "Cartoon cups",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "linkage",
    name: "Linkage",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "cartoon_packaging_machine",
    name: "Cartoon packaging machine",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "package_tying_machine",
    name: "Package tying machine",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "shrink_packaging_machine",
    name: "Shrink packaging machine",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
  {
    id: "plate_processor",
    name: "Plate processor",
    machines: [], // Will be populated from API
    categoryType: "digital_offset",
  },
];

// Roll/Flexo Finishing Categories Configuration
export const initializeRollFlexoFinishingCategories =
  (): FinishingCategory[] => [
    {
      id: "cnc_digital_diecut_roll",
      name: "CNC (Digital Diecut)",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "die_cut_roll",
      name: "Die Cut",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "lamination_roll",
      name: "Lamination",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "varnish_roll",
      name: "Varnish",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "embossing_roll",
      name: "Embossing",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "selective_coating_roll",
      name: "Selective Coating",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "roll_sheeter_slitter",
      name: "Roll Sheeter/Slitter",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "carton_packaging_machine_roll",
      name: "Carton Packaging Machine",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "package_tying_machine_roll",
      name: "Package Tying Machine",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
    {
      id: "shrink_packaging_machine_roll",
      name: "Shrink Packaging Machine",
      machines: [], // Will be populated from API
      categoryType: "roll_flexo",
    },
  ];

// Step configuration
export const STEPS_CONFIG = {
  steps: [
    "Select Machines",
    "Select Finishing Actions",
    "Select Roll/Flexo Finishing",
  ],
  stepDescriptions: {
    0: "Select your printing machines from any category",
    1: "Configure finishing machines for Digital/Offset printing",
    2: "Configure finishing machines for Roll/Flexo printing",
  },
};
