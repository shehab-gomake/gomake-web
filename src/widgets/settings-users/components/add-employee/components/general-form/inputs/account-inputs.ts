import {IUserData} from "@/widgets/settings-users/interface/employee";

const accountInputs = (state: IUserData)  => {
    return [
        {
            name: "username",
            label: "usersSettings.username",
            type: "text",
            placeholder: "usersSettings.username",
            required: true,
            parameterKey: "username",
            options: [],
            value: state.username,
            machineInputType: 'input',
            isValid: !!state.username,
        },
        {
            name: "password",
            label: "usersSettings.password",
            type: "text",
            placeholder: "usersSettings.password",
            required: true,
            parameterKey: "password",
            options: [],
            value: state.password,
            machineInputType: 'input',
            isValid: !!state.password,
        },
        {
            name: "roleID",
            label: "usersSettings.roleID",
            type: "select",
            placeholder: "usersSettings.roleID",
            required: true,
            parameterKey: "roleID",
            value: state.roleID,
            options: [],
            isValid: true,
            optionsUrl: '/v1/crm-service/roles/get-all-roles'
        },
        {
            name: "isCanLoginWithCode",
            label: "usersSettings.isCanLoginWithCode",
            type: "switch",
            placeholder: "usersSettings.isCanLoginWithCode",
            required: true,
            parameterKey: "isCanLoginWithCode",
            value: state.isCanLoginWithCode,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
    ];
}

export {accountInputs};