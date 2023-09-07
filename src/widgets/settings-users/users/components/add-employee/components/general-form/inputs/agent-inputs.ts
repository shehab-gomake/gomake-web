import {Employee} from "@/widgets/settings-users/users/interface/employee";

const agentInputs = (state: Employee)  => {
    return [
        {
            name: "mailService",
            label: "usersSettings.mailService",
            type: "text",
            placeholder: "usersSettings.mailService",
            required: false,
            parameterKey: "mailService",
            options: [],
            value: state.mailService,
            machineInputType: 'input',
            isValid: !!state.mailService,
            disabled: !state.isAgent
        },
        {
            name: "mailServicePassword",
            label: "usersSettings.mailServicePassword",
            type: "text",
            placeholder: "usersSettings.mailServicePassword",
            required: false,
            parameterKey: "mailServicePassword",
            options: [],
            value: state.mailServicePassword,
            machineInputType: 'input',
            isValid: !!state.mailServicePassword,
            disabled: !state.isAgent

        },
    ];
}


export {agentInputs};