import { atom } from "recoil";

// Selected production statuses match backend enum values
// 1 = InProcess, 2 = Ready
const selectedProductionStatusesState = atom<number[]>({
  key: "selectedProductionStatusesState",
  default: [],
});

export { selectedProductionStatusesState };
