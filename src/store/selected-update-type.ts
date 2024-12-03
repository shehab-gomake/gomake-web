import { UpdateTypes } from "@/widgets/shared-admin-customers/add-product/parameters/widgets/section-mapping";
import { atom } from "recoil";

export const selectedUpdateTypeState = atom({
  key: "selectedUpdateTypeState",
  default: null as UpdateTypes | null, 
});
