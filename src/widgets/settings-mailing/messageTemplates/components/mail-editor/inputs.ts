const mailInputs1 = (state) => {
    return [
        {
            name: "sendFrom",
            label: "mailingSettings.sendFrom",
            type: "text",
            required: false,
            parameterKey: "sendFrom",
            options: [],
            value: state?.sendFrom,
            isValid: true,
        },
    ]
}

const mailInputs2 = (state) => {
    return [
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
            direction: "row"
        },
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
            direction: "row",

        },
    ]
}
const mailInputs3 = (state) => {
    return [
        {
            name: "bccMail",
            type: "text",
            required: false,
            parameterKey: "bccMail",
            options: [],
            value: state?.bccMail,
            isValid: true,
            disabled: !state?.sendMailCopy
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
            direction: "row",
            disabled: !state?.sendMailCopy

        },
    ]
}

export { mailInputs1, mailInputs2, mailInputs3 };