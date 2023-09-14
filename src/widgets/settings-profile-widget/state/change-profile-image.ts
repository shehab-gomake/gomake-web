import { atom } from "recoil";

export const changeProfileImageState = atom<boolean>({
    key: "changeProfileImageModalState",
    default: false,
});

export const changeProfileInitialsState = atom<boolean>({
    key: "changeProfileInitialsModalState",
    default: false,
});
