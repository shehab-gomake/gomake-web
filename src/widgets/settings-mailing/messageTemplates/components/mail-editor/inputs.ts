const toolBarInputs = (state) => {

    return [
        {
            name: "fromAgentMail",
            label: "mailingSettings.fromAgentMail",
            type: "switch",
            placeholder: "mailingSettings.fromAgentMail",
            required: false,
            parameterKey: "sendFromAgent",
            options: [],
            value: state?.sendFromAgent,
            isValid: true,
            direction : "row"
        },
        {
            name: "sendCopyToMainMail",
            label: "mailingSettings.sendCopyToMainMail",
            type: "switch",
            placeholder: "mailingSettings.sendCopyToMainMail",
            required: false,
            parameterKey: "sendMailCopy",
            options: [],
            value: state?.sendMailCopy,
            isValid: true,
            direction : "row"
        },
        {
            name: "sendCopyToAgentMail",
            label: "mailingSettings.sendCopyToAgentMail",
            type: "switch",
            placeholder: "mailingSettings.sendCopyToAgentMail",
            required: false,
            parameterKey: "sendMailCopyToAgent",
            options: [],
            value: state?.sendMailCopyToAgent,
            isValid: true,
            direction : "row"
        },
    ]
}

export { toolBarInputs };