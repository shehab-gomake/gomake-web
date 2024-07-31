import {atom} from "recoil";

export const chatDialogIdState = atom<string>({
    default: '',
    key: 'chatDialogIdState'
})