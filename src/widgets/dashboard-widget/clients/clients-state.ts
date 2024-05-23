import {atom} from "recoil";

export const dashboardClientsState = atom<any[]>({
    key: 'dashboardClientsState',
    default: []
})
