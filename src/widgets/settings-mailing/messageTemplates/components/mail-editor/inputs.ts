const toolBarInputs = (state) => {

    return [
        {
            name: "fromAgentMail",
            label: "mailingSettings.fromAgentMail",
            type: "switch",
            placeholder: "mailingSettings.fromAgentMail",
            required: false,
            parameterKey: "isChecked",
            options: [],
            value: state?.isChecked,
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