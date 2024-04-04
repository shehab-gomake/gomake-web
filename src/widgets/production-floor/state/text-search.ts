import {atom} from "recoil";

export const productionFloorTextSearchState = atom<string>({
    key: 'textSearchState',
    default: ""
})