import { atom } from "recoil";

// Selected production status matches backend enum values
// 1 = InProcess, 2 = Ready
const selectedProductionStatusesState = atom<number | null>({
  key: "selectedProductionStatusesState",
  default: null,
});

export { selectedProductionStatusesState };
