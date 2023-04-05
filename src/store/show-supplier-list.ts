import { atom } from "recoil";

const _default: IShowSupplierList = {
  stateShow: false,
  widget: {},
  item: {},
  key: "",
};
export const ShowSupplierList = atom({
  key: "showSupplierList",
  default: _default,
});

export interface IShowSupplierList {
  stateShow: boolean;
  widget: any;
  item: any;
  key: string;
}
