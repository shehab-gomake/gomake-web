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
