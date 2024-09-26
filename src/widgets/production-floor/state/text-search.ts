import {atom} from "recoil";

export const productionFloorTextSearchState = atom<string>({
    key: 'textSearchState',
    default: ""
})

export const selectedChipIdsState = atom({
    key: 'selectedChipIdsState', 
    default: [], 
});