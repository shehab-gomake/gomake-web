import { atom } from "recoil";


export const firstWidgetState = atom<boolean>({
    key: "firstWidgetState",
    default: false,
});

export const secondWidgetState = atom<boolean>({
    key: "secondWidgetState",
    default: false,
});

export const thirdWidgetState = atom<boolean>({
    key: "thirdWidgetState",
    default: true,
});

export const isTransactedState = atom<boolean>({
    key: "isTransactedState",
    default: false,
});