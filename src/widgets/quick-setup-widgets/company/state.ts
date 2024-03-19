import {atom} from "recoil";

export interface ICompanyDataState {
    name: string;
    domain: string;
    systemLanguage: string;
    systemCurrency: string;

}
export const signupCompanyState = atom<ICompanyDataState>({
    default: {
        name: '',
        domain: '',
        systemLanguage: '',
        systemCurrency: '',
    },
    key: 'signupCompanyState'
})