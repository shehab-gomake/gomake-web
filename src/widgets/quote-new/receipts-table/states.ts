import { atom } from "recoil";


export const firstWidgetState = atom<boolean>({
    key: "firstWidgetState",
    default: true,
});

export const secondWidgetState = atom<boolean>({
    key: "secondWidgetState",
    default: false,
});

export const thirdWidgetState = atom<boolean>({
    key: "thirdWidgetState",
    default: false,
});

export const isTransactedState = atom<boolean>({
    key: "isTransactedState",
    default: false,
});