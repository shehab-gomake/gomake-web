import {atom} from "recoil";

export const updatedApprovalRequestIdState = atom<string>({
    default: '',
    key: 'approvedFileMessageIdState'
})