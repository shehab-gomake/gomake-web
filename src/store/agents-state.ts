import {atom} from "recoil";
const agentsState = atom<{id: string; name: string; code: string;}[]>({
    key: 'agentsState', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});

export {agentsState}