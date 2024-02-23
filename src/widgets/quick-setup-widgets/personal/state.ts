import {atom, selector} from "recoil";
import {emailRegex} from "@/utils/regex";

export interface IPersonalDataState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    rePassword: string;
}
export const signupPersonalState = atom<IPersonalDataState>({
    default: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        rePassword: ''
    },
    key: 'signupPersonalState'
});

export const isValidSignUpForm = selector<boolean>({
    key: 'isValidSignUpForm',
    get: ({get}) => {
        let isValid: boolean = true;
        const state = get(signupPersonalState);
        const requiredValidation: boolean = Object.keys(state).every(key => !!state[key]);
        const passLengthValidation: boolean = state?.password?.length > 7;
        const emailValidation: boolean = emailRegex.test(state.email);
        const rePassValidation: boolean = state.rePassword === state.password;
        if (!requiredValidation || !passLengthValidation || !emailValidation || !rePassValidation) {
            isValid = false;
        }
        return isValid
    }
});