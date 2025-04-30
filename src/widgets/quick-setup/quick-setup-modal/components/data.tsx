export type Step =
  | { type: "methods" }
  | { type: "finishing-digital-offset" }
  | { type: "book-finishing" }
  | { type: "finishing-roll" }
  | { type: "finishing-wide" }
  | { type: "finishing-dtf" }
  | { type: "packing" }
  | { type: "summary" };

export type StepNew =
  | { type: "methods" }
  | { type: "finishing-digital-offset" }
  | { type: "book-finishing" }
  | { type: "material-digital-offset" }
  | { type: "finishing-roll" }
  | { type: "material-roll" }
  | { type: "finishing-wide" }
  | { type: "material-wide" }
  | { type: "finishing-dtf" }
  | { type: "material-dtf" }
  | { type: "packing" }
  | { type: "summary" };

// Actions for each category

export const finishingActionsDigitalOffset = [
  "CNC (Digital Diecut)",
  "Guillotine",
  "Diecut Analog",
  "Punching/Drilling",
  "Rounding Corners",
  "Folding",
  "Pasting Blocks",
  "Scoring & Perforation",
  "Folding and Gluing",
  "Digital Foil",
  "Foil/Impose Stamp",
  "Digital Selective Lamination",
  "Encapsulation",
  "Manual Sewing",
  "Side Coloring",
  "Card Cutting",
  "Embroidery",
  "Cartoon Cups",
  "Linkage",
  "Plate Processor", // we'll hide dynamically if needed
];

export const bookFinishingActions = [
  "Booklet",
  "Perfect Binding",
  "Books Sewing",
  "Spiral",
  "Manual Stapler Machine",
  "Hardcover Cover",
  "Three Knife Trimmer",
  "Collector",
];

export const finishingActionsRollPrinting = [
  "CNC",
  "Die Cut",
  "Foil/Impose Stamp",
  "Imposr",
  "Selective",
  "Roll Sheeter Machine",
];

export const finishingActionsWidePrinter = [
  "CNC",
  "Manual Cutting",
  "Manual Peeling Stickers",
  "Ring Eyelet Punching Machine",
  "Linkage Machine",
  "PVC Bending",
  "Letter Sides Bending Machine",
  "Light Boxes & Letter Assembly",
  "Cold Lamination",
];

export const finishingActionsDTF = [
  "Silk Mesh Processor",
  "Silk Printer",
  "Press Machine",
];

export const packingMethods = [
  "Shrink Packaging Machine",
  "Package Tying Machine",
  "Cartoon Packaging Machine",
];

export const setupStepsConfigOld = {
  steps: [
    {
      type: "methods",
      label: "Select Printing Methods",
      options: [
        "Digital Printing",
        "Offset Printing",
        "Roll Digital Printing",
        "Roll Offset Printing",
        "Flexo Printing",
        "Wide Printer",
        "DTF & Sublimation",
      ],
    },
    {
      type: "finishing-digital-offset",
      label: "Select Finishing Actions (Digital/Offset)",
      options: {
        dependsOn: ["Digital Printing", "Offset Printing"],
        values: ["Cutting", "Laminating", "Plate Processor", "Folding"],
        filterIf: {
          notIncludes: "Offset Printing",
          exclude: ["Plate Processor"],
        },
      },
    },
    {
      type: "book-finishing",
      label: "Select Book Finishing Actions",
      dependsOn: ["Digital Printing", "Offset Printing"],
      options: ["Perfect Binding", "Saddle Stitching", "Hardcover Binding"],
    },
    {
      type: "finishing-roll",
      label: "Select Roll Finishing Actions",
      dependsOn: [
        "Roll Digital Printing",
        "Roll Offset Printing",
        "Flexo Printing",
      ],
      options: ["Slitting", "Rewinding", "Varnishing"],
    },
    {
      type: "finishing-wide",
      label: "Select Wide Printer Actions",
      dependsOn: ["Wide Printer"],
      options: ["Trimming", "Mounting"],
    },
    {
      type: "finishing-dtf",
      label: "Select DTF & Sublimation Actions",
      dependsOn: ["DTF & Sublimation"],
      options: ["Heat Press", "Powder Coating"],
    },
    {
      type: "packing",
      label: "Select Packing Methods",
      options: ["Boxing", "Shrink Wrap", "Palletizing"],
    },
    {
      type: "summary",
      label: "Review Your Selections",
    },
  ],
};

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

export const setupStepsConfig: SetupStepConfig[] = [
  {
    type: "methods",
    label: "Select Printing Methods",
    options: [
      "Digital Printing",
      "Offset Printing",
      "Roll Digital Printing",
      "Roll Offset Printing",
      "Flexo Printing",
      "Wide Printer",
      "DTF & Sublimation",
    ],
  },
  {
    type: "finishing-digital-offset",
    label: "Select Finishing Actions (Digital/Offset)",
    dependsOn: ["Digital Printing", "Offset Printing"],
    options: finishingActionsDigitalOffset,
    filter: {
      condition: (selected) => !selected.includes("Offset Printing"),
      exclude: ["Plate Processor"],
    },
  },
  {
    type: "book-finishing",
    label: "Select Book Finishing Actions",
    dependsOn: ["Digital Printing", "Offset Printing"],
    options: bookFinishingActions,
  },
  {
    type: "finishing-roll",
    label: "Select Roll Finishing Actions",
    dependsOn: [
      "Roll Digital Printing",
      "Roll Offset Printing",
      "Flexo Printing",
    ],
    options: finishingActionsRollPrinting,
  },
  {
    type: "finishing-wide",
    label: "Select Wide Printer Actions",
    dependsOn: ["Wide Printer"],
    options: finishingActionsWidePrinter,
  },
  {
    type: "finishing-dtf",
    label: "Select DTF & Sublimation Actions",
    dependsOn: ["DTF & Sublimation"],
    options: finishingActionsDTF,
  },
  {
    type: "packing",
    label: "Select Packing Methods",
    options: packingMethods,
  },
  {
    type: "summary",
    label: "Review Summary",
  },
];
