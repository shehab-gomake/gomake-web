import {atom} from "recoil";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";

export const messengerDialogsState = atom<IChatDialog[]>({
    default: [],
    key: 'messengerDialogsState'
})