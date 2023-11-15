const groupNameInput = (state: any)  => {
    return [
        {
            name: "groupName",
            label: "",
            type: "text",
            placeholder: "mailingSettings.groupName",
            required: false,
            parameterKey: "name",
            options: [],
            value: state?.name,
            isValid: true,
        },
    ];
}

export {groupNameInput};