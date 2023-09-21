import { atom } from "recoil";
import {EActions} from "@/widgets/settings-users/Permissions/enum/actions";

interface IState {
    isOpen: boolean,
    action: null | EActions
}
export const addUpdatePermissionRoleModalState = atom<IState>({
    key: "addUpdatePermissionRoleModalState",
    default: {isOpen: false, action: null},
});
