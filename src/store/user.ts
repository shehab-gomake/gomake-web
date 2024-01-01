import {atom} from "recoil";

export const userState = atom({
    key: "userState",
    default: {},
});
export const systemCurrencyState = atom({
    key: "systemCurrencyState",
    default: "",
});
