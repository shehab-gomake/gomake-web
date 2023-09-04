import { atom } from "recoil";
import {IUserData} from "@/widgets/settings-users/interface/employee";

export const initState: IUserData = {
  username: "",
  password: "",
  roleID: "",
  isCanLoginWithCode: false,
  allowedIPs: [],
  employee: {
    agentCode: null,
    firstname: null,
    lastname: null,
    phone: null,
    email: null,
    isActive: false,
    isWorkingOnCommonBoard: null,
    isHaveFullKanbanPermission: false,
    pinCode: null,
    isAgent: false,
    isGraphicArtist: null,
    isCourier: null,
    mailService: null,
    mailServicePassword: "",
    creationDate: new Date(),
    mailProviderId: null,
    smsTemplatesGroupId: null,
    quoteLimitationType: null,
    quotePriceLimit: null,
    mailProvider: null,
    PinCodeForLoginWithApplication: null
  }
};
export const employeeState = atom<IUserData>({
  key: "employeeState",
  default: initState,
});

