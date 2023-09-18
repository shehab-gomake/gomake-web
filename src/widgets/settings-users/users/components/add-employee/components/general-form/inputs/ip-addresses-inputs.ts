import {IUserData} from "@/widgets/settings-users/users/interface/employee";
import {ipAddressRegex} from "@/utils/regex";

const ipAddressesInputs = (state: IUserData)  => {
    return [
        {
            name: 'usersSettings.ipAddresses',
            parameterKey: 'allowedIPs',
            value: state.allowedIPs || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "ip",
                    label: "usersSettings.ip",
                    type: "text",
                    placeholder: "usersSettings.ip",
                    required: true,
                    parameterKey: "ip",
                    options: [],
                    readonly: true,
                    isValid: true,
                    regex: ipAddressRegex
                },
                {
                    name: "description",
                    label: "usersSettings.description",
                    type: "text",
                    placeholder: "usersSettings.description",
                    required: false,
                    parameterKey: "description",
                    options: [],
                    readonly: true,
                    isValid: true
                },
                {
                    name: "isActiveIp",
                    label: "usersSettings.isActive",
                    type: "switch",
                    placeholder: "usersSettings.isActive",
                    required: false,
                    parameterKey: "isActive",
                    options: [],
                    isValid: true,
                    disabled: true,
                },
            ]
        },
    ];
}

export {ipAddressesInputs};