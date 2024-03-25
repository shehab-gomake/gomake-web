import {IUserData} from "@/widgets/settings-users/users/interface/employee";
import {EmployeeActions} from "@/widgets/settings-users/users/enums/employee-actions";
import {emailRegex} from "@/utils/regex";

const accountInputs = (state: IUserData, action: EmployeeActions)  => {
    return [
        {
            name: "email",
            label: "usersSettings.email",
            type: "text",
            placeholder: "usersSettings.email",
            required: true,
            parameterKey: "email",
            options: [],
            value: state.email,
            machineInputType: 'input',
            isValid: !!state.email,
            regex: emailRegex
        },
        {
            name: "password",
            label: "usersSettings.password",
            type: "password",
            placeholder: "usersSettings.password",
            required: true,
            parameterKey: "password",
            options: [],
            //value: state.password,
            machineInputType: 'input',
            isValid: !!state.password,
           // disabled: action === EmployeeActions.UPDATE
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
            required: false,
            parameterKey: "isCanLoginWithCode",
            value: state.isCanLoginWithCode,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
    ];
}

export {accountInputs};