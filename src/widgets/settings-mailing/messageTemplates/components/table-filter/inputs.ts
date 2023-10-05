const filterInput = (state: any)  => {
    return [
        {
            name: "SMSgroup",
            label: "mailingSettings.group",
            type: "select",
            placeholder: "mailingSettings.group",
            required: false,
            parameterKey: "name",
            value: state?.name,
            optionsUrl: "/v1/crm-service/roles/get-all-sms-templates"
        }
    ];
}

const switchInputs = (state: any)  => {
    return [
        {
            name: "",
            label: "mailingSettings.sendViaSms",
            type: "switch",
            placeholder: "mailingSettings.sendViaSms",
            required: false,
            parameterKey: "isSendViaSms",
            options: [],
            value: state?.isSendViaSms,
            isValid: true,
        },
        {
            name: "default",
            label: "mailingSettings.sendThroughTwilio",
            type: "switch",
            placeholder: "mailingSettings.sendThroughTwilio",
            required: false,
            parameterKey: "isSendThroughTwilio",
            options: [],
            value: state?.isSendThroughTwilio,
            isValid: true,
        }
    ];
}

export {filterInput , switchInputs};