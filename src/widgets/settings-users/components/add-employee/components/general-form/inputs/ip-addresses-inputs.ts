import {IUserData} from "@/widgets/settings-users/interface/employee";

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
                    options: []
                },
                {
                    name: "description",
                    label: "usersSettings.description",
                    type: "text",
                    placeholder: "usersSettings.description",
                    required: true,
                    parameterKey: "description",
                    options: []
                },
            ]
        },
    ];
}

export {ipAddressesInputs};