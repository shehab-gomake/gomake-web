import { atom } from "recoil";

export const printHouseCountryState = atom<string>({
  key: "printHouseCountryState",
  default: "",
});
