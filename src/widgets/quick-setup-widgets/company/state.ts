import {atom} from "recoil";

export interface ICompanyDataState {
    name: string;
    domain: string;
    systemLanguage: string;
    systemCurrency: string;
    supportedLanguage:boolean;

}
export const signupCompanyState = atom<ICompanyDataState>({
    default: {
        name: '',
        domain: '',
        systemLanguage: '',
        systemCurrency: '',
        supportedLanguage:false,
    },
    key: 'signupCompanyState'
})