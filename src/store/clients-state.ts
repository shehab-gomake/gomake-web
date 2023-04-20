import {atom} from "recoil";
const clientsState = atom<{id: string; name: string}[]>({
    key: 'clientsState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});

export {clientsState}