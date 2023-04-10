import { atom } from "recoil";
const _default: IRefetchMaterialDataState = {
  refetch: () => {},
};
export const refetchMaterialDataState = atom({
  key: "refetchMaterialDataState",
  default: _default,
});

export interface IRefetchMaterialDataState {
  refetch: () => void;
}
