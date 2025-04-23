import { atom } from "recoil";

const selectedClientTypesIdsState = atom({
  key: "selectedClientTypesIdsState",
  default: [],
});

export { selectedClientTypesIdsState };
