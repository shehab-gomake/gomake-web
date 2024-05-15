import {atom} from "recoil";

export interface ICountry {
    name:string;
	lang:string;
	currency:string;
}
export interface ISystemLanguage{
    value: string;
    text: string;
    supported:boolean;
    label: string;
}
export interface ISystemCurrency{
    value: string;
    label: string;
}
export interface ICompanyDataState {
    name: string;
    domain: string;
    supportedLanguage:boolean;
    email:string;
    fullName:string;
    phone:string;
    country:ICountry,
    systemCurrency:ISystemCurrency;
    systemLanguage:ISystemLanguage;


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
        },
        systemLanguage:
        {
            value: "",
            text: "",
            supported:false,
            label: "",  
        },
        systemCurrency:{
            value: "",
            label:""
        },
    },
    key: 'signupCompanyState'
})