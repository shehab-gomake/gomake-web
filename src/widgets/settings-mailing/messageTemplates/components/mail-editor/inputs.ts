
const mailInputs = (state) => {
    return [
        {
            name: "sendEmailTo",
            label: "mailingSettings.sendEmailTo",
            type: "text",
            required: false,
            placeholder: "mailingSettings.sendEmailTo",
            parameterKey: "sendTo",
            options: [],
            value: state?.sendTo,
            isValid: true,
        },
        {
            name: "send to agent",
            label: "mailingSettings.sendToAgent",
            type: "primeSwitch",
            placeholder: "mailingSettings.sendToAgent",
            required: false,
            parameterKey: "isToAgent",
            options: [],
            value: state?.isToAgent,
            isValid: true,
            direction: "row",
        },
    ]
}

const mailInputs1 = (state) => {
    return [
        {
            name: "sendFrom",
            label: "mailingSettings.sendFrom",
            type: "text",
            required: false,
            placeholder: "mailingSettings.enterEmail",
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
            type: "primeSwitch",
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
            type: "primeSwitch",
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
            placeholder: "mailingSettings.enterEmail",
            options: [],
            value: state?.bccMail,
            isValid: true,
            disabled: !state?.sendMailCopy
        },
        {
            name: "sendCopyToAgentMail",
            label: "mailingSettings.sendCopyToAgentMail",
            type: "primeSwitch",
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



export { mailInputs, mailInputs1, mailInputs2, mailInputs3 };