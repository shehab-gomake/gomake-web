const userInputs = (state, showPass) => {
    return [
        {
            name: "email",
            label: "customers.modal.email",
            type: "text",
            placeholder: "customers.modal.email",
            required: true,
            parameterKey: "email",
            options: [],
            value: state?.email,
            isValid: true,
            readonly: false,
        },
        {
            name: "userName",
            label: "customers.modal.userName",
            type: "text",
            placeholder: "customers.modal.userName",
            required: false,
            parameterKey: "username",
            options: [],
            value: state?.username,
            isValid: !!state.username,
            readonly: false,
            disabled: true,
        },
        {
            name: "password",
            label: "customers.modal.password",
            type: "password",
            placeholder: "customers.modal.password",
            required: true,
            parameterKey: "password",
            options: [],
            value: state?.password,
            isValid: true,
            disabled: showPass,
        },
    ];
}

const userInputs1 = (state) => {
    return [
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
            optionsUrl: "/v1/enum/get-enums/languages",
            value: state?.systemLanguage,
            isValid: true,
        },
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
        }
    ]
}

export { userInputs, userInputs1 };