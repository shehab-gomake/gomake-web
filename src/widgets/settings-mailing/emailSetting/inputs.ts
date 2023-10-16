import { useEmailSetting } from "./useEmailSetting";


const toolBarInputs = (state) => {
    const {variables } = useEmailSetting();

    return [
        {
            name: "variable",
            type: "select",
            placeholder: "insert variable",
            required: false,
            parameterKey: "variable",
            options:  
            variables.map(variable => ({
                value: variable.id,
                text: variable.label
            })),
            value: state?.variable,
        },
        {
            name: "fromAgentMail",
            label: "mailingSettings.fromAgentMail",
            type: "switch",
            placeholder: "mailingSettings.fromAgentMail",
            required: false,
            parameterKey: "fromAgentMail",
            options: [],
            value: state?.fromAgentMail,
            isValid: true,
            direction : "row"
        },
        {
            name: "sendCopyToMainMail",
            label: "mailingSettings.sendCopyToMainMail",
            type: "switch",
            placeholder: "mailingSettings.sendCopyToMainMail",
            required: false,
            parameterKey: "sendCopyToMainMail",
            options: [],
            value: state?.sendCopyToMainMail,
            isValid: true,
            direction : "row"
        },
        {
            name: "sendCopyToAgentMail",
            label: "mailingSettings.sendCopyToAgentMail",
            type: "switch",
            placeholder: "mailingSettings.sendCopyToAgentMail",
            required: false,
            parameterKey: "sendCopyToAgentMail",
            options: [],
            value: state?.sendCopyToAgentMail,
            isValid: true,
            direction : "row"
        },
    ]
}

export { toolBarInputs };