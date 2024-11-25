import { atom } from "recoil";

export const boardMissionMaterialState = atom<any>({
  key: "boardMissionMaterialState",
  default: undefined,
});

export const materialModalState = atom<boolean>({
  key: "materialModalState",
  default: false,
});
