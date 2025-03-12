import {atom} from "recoil";

export const loadingGanttItemId = atom<string>({
    key: 'loadingGanttItemId',
    default: '',
})