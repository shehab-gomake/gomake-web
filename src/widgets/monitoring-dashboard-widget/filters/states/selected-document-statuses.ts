import { atom } from "recoil";

// Selected document statuses match backend enum values
// 1 = Open, 2 = Closed, 3 = PartialClosed
const selectedDocumentStatusesState = atom<number[]>({
  key: "selectedDocumentStatusesState",
  default: [],
});

export { selectedDocumentStatusesState };


