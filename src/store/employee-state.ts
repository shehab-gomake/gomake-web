import { atom } from "recoil";
import {IUserData} from "@/widgets/settings-users/users/interface/employee";

export const initState: IUserData = {
  username: "",
  password: "",
  roleID: "",
  email:"",
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
    isGraphicArtist: false,
    isCourier: null,
    mailService: null,
    mailServicePassword: "",
    creationDate: new Date(),
    mailProviderId: null,
    smsTemplatesGroupId: null,
    quoteLimitationType: null,
    quotePriceLimit: null,
    mailProvider: null,
    pinCodeForLoginWithApplication: null,
    actionIds:[]
  }
};
export const employeeState = atom<IUserData>({
  key: "employeeState",
  default: initState,
});

