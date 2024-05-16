import {atom} from "recoil";

const selectedAgentIdsState = atom({
    key: 'selectedAgentIdsState',
    default: []
});

export {selectedAgentIdsState};