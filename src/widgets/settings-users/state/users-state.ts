import { atom } from "recoil";
import {IUser} from "@/widgets/settings-users/users/interface/user";

export const usersArrayState = atom<IUser[]>({
  key: "usersArrayTableState",
  default: [],
});



