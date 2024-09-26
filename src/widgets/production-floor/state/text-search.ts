import {atom} from "recoil";

export const productionFloorTextSearchState = atom<string>({
    key: 'textSearchState',
    default: ""
})

// export const selectedChipIdState = atom<any>({
//     key: 'selectedChipIdState',
//     default: ""
// })

export const selectedChipIdsState = atom({
    key: 'selectedChipIdsState', 
    default: [], 
});