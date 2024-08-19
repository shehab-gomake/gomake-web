import {atom} from "recoil";

export const unreadMessagesCountState = atom<number>({
    default: 0,
    key: 'unreadMessagesCountState'
});

export const isUpdateDialogsState = atom<boolean>({
    default: false,
    key: 'unreadMessagesCountState'
})