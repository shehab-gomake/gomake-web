import {Employee} from "@/widgets/settings-users/interface/employee";

const agentInputs = (state: Employee)  => {
    return [
        {
            name: "mailService",
            label: "usersSettings.mailService",
            type: "text",
            placeholder: "usersSettings.mailService",
            required: true,
            parameterKey: "mailService",
            options: [],
            value: state.mailService,
            machineInputType: 'input',
            isValid: !!state.mailService,
        },
        {
            name: "mailServicePassword",
            label: "usersSettings.mailServicePassword",
            type: "text",
            placeholder: "usersSettings.mailServicePassword",
            required: true,
            parameterKey: "mailServicePassword",
            options: [],
            value: state.mailServicePassword,
            machineInputType: 'input',
            isValid: !!state.mailServicePassword,
        },
    ];
}

export {agentInputs};