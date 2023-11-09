import { ETabsIcon } from "@/enums";
import { FinishingIcon, PricingIcon, PrintingDetailsIcon } from "@/icons";

export const _renderActiveIcon = (icon) => {
  if (icon === ETabsIcon.PRINTING_DETAILS) {
    return <PrintingDetailsIcon />;
  }
  if (icon === ETabsIcon.FINISHING) {
    return <FinishingIcon />;
  }
  if (icon === ETabsIcon.PRICING) {
    return <PricingIcon />;
  }
};
export const _renderUnActiveIcon = (icon) => {
  if (icon === ETabsIcon.PRINTING_DETAILS) {
    return <PrintingDetailsIcon stroke="#1C1D58" />;
  }
  if (icon === ETabsIcon.FINISHING) {
    return <FinishingIcon stroke="#1C1D58" />;
  }
  if (icon === ETabsIcon.PRICING) {
    return <PricingIcon stroke="#1C1D58" />;
  }
};

export const compareStrings = (string1, string2) => {
  return string1?.toLowerCase() === string2?.toLowerCase();
};
