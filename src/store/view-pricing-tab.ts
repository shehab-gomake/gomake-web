import { EPricingViews } from "@/widgets/product-pricing-widget/enums";
import { atom } from "recoil";

export const viewPricingTab = atom({
  key: "viewPricingTab",
  default: EPricingViews.SELECTED_WORKFLOW,
});

export const actionListForWorkFlow = atom({
  key: "actionListForWorkFlow",
  default: [],
});