import {atom} from "recoil";

export const tagsState = atom<string[]>({
    default: [],
    key: 'tagsState'
});