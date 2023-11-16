import {atom} from "recoil";

export const userProfileState = atom<IUserProfile>({
    key: "userProfileState",
    default: {
        userId: '',
        employeeId: '',
        firstName: '',
        lastName: '',
        systemLang: '',
        role: '',
        email: '',
        phoneNumber: '',
        imagePath: '',
        avatarBackGroundColor: '',
        avatarInitials: ''
    },
});

export interface IUserProfile {
    userId: string,
    employeeId: string,
    firstName: string,
    lastName: string,
    systemLang: string,
    role: string,
    email: string,
    phoneNumber: string,
    imagePath: string,
    avatarBackGroundColor: string,
    avatarInitials: string;
}