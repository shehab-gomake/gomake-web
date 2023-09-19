import { atom } from "recoil";

export const propertyState = atom({
  key: "propertyState",
  default: {
    openAddModalRule: false,
  },
});
