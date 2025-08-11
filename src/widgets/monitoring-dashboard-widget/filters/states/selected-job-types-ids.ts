import { atom } from "recoil";

const selectedJobTypesIdsState = atom({
  key: "selectedJobTypesIdsState",
  default: ["internal", "partial-out-source", "out-source"],
});

export { selectedJobTypesIdsState };
