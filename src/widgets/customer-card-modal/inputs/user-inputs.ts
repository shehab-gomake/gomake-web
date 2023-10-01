import {emailRegex} from "@/utils/regex";

const userInputs = (state)  => {
    return [
        {
            name: "userName",
            label: "customers.modal.userName",
            type: "text",
            placeholder: "customers.modal.userName",
            required: true,
            parameterKey: "username",
            options: [],
            value: state?.username,
            isValid: !!state.username,
            readonly: false ,
           // regex: emailRegex
        },
        {
            name: "password",
            label: "customers.modal.password",
            type: "text",
            placeholder: "customers.modal.password",
            required: true,
            parameterKey: "password",
            options: [],
            value: state?.password,
            isValid: true,
            readonly: false,
        },
        {
            name: "email",
            label: "customers.modal.email",
            type: "text",
            placeholder: "customers.modal.email",
            required: false,
            parameterKey: "email",
            options: [],
            value: state?.email,
            isValid: true,
            readonly: false,
        },
        
        {
            name: "IPaddress",
            label: "customers.modal.IPaddress",
            type: "text",
            placeholder: "customers.modal.IPaddress",
            required: false,
            parameterKey: "userIPAddress",
            options: [],
            value: state?.userIPAddress,
            isValid: true,
            readonly: false,
        },
        {
            name: "language",
            label: "customers.modal.language",
            type: "select",
            placeholder: "customers.modal.language",
            required: false,
            parameterKey: "systemLanguage",
            options: [],
            optionsUrl:"/v1/enum/get-enums/languages",
            value: state?.systemLanguage,
            isValid: true,
        },
        
    ];
}

const userInputs1 = (state)  => {
    return [
        {
            name: "loginUsingEmailCode",
            label: "customers.modal.loginUsingEmailCode",
            type: "switch",
            placeholder: "customers.modal.loginUsingEmailCode",
            required: false,
            parameterKey: "isCanLoginWithCode",
            options: [],
            value: state?.isCanLoginWithCode,
            isValid: true,
        },
    ]
}

export {userInputs , userInputs1};