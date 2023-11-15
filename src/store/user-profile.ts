import {atom} from "recoil";

export const userProfileState = atom<IUserProfile>({
    key: "userProfileState",
    default: {} as IUserProfile,
});

export interface IUserProfile {
    id: string,
    employeeId: string,
    firstName: string,
    lastName: string,
    systemLang: string,
    role: string,
    email: string,
    phoneNumber: string,
    imagePath: string,
    avatarBackGroundColor: string,
    avatarInitials: string
}