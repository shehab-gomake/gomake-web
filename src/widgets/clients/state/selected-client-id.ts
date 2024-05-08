import {atom} from "recoil";

const selectedClientIdState = atom({
    key: 'selectedClientIdState',
    default: ''
});

export {selectedClientIdState};