import {atom} from "recoil";

const selectedAgentIdState = atom({
    key: 'selectedAgentIdState',
    default: ''
});

export {selectedAgentIdState};