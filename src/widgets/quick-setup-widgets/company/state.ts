import {atom} from "recoil";

export interface ICompanyDataState {
    name: string;
    domain: string;
    systemLanguage: string;
    systemCurrency: string;
    supportedLanguage:boolean;
    email:string;
    fullName:string;
    phone:string;

}
export const signupCompanyState = atom<ICompanyDataState>({
    default: {
        name: '',
        domain: '',
        systemLanguage: '',
        systemCurrency: '',
        supportedLanguage:false,
        email:"",
        fullName:"",
        phone:"",
    },
    key: 'signupCompanyState'
})