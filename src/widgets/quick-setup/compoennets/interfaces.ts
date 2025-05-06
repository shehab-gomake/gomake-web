export interface ProductsSetupData {
  printingMethods: string[];
  finishingActions: {
    digital_offset_printing?: string[];
    roll_printing?: string[];
    wide_printer?: string[];
    dtf_sublimation?: string[];
  };
  bookFinishingActions: string[];
  materials: {
    digital_offset: string[];
    roll: {
      maxWidth: string;
    };
    wide_printer: {
      types: string[];
      maxWidth: string;
      maxLength: string;
    };
  };
  packingMethods: string[];
}
