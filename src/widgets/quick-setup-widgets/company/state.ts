import {atom} from "recoil";

export interface ICountry {
    name:string;
	lang:string;
	currency:string;
}
export interface ICompanyDataState {
    name: string;
    domain: string;
    supportedLanguage:boolean;
    email:string;
    fullName:string;
    phone:string;
    country:ICountry

}
export const signupCompanyState = atom<ICompanyDataState>({
    default: {
        name: '',
        domain: '',
        supportedLanguage:false,
        email:"",
        fullName:"",
        phone:"",
        country:{
            name: '',
            lang: '',
            currency: '',
        }
    },
    key: 'signupCompanyState'
})