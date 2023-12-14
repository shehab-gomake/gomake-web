const inputs = (state)  => {
    return [
        {
            name: "Key",
            label: "Key",
            type: "text",
         //   placeholder: "customers.modal.email",
            required: false,
            parameterKey: "mail",
            options: [],
            value: state?.key,
            isValid: true,
            readOnly: true
        },
        {
            name: "English",
            label: "English",
            type: "text",
            // placeholder: "customers.modal.phone1",
            required: false,
            parameterKey: "en",
            options: [],
            value: state?.en,
            isValid: true,
        },
        {
            name: "Hebrew",
            label: "Hebrew",
            type: "text",
            // placeholder: "customers.modal.phone2",
            required: false,
            parameterKey: "he",
            options: [],
            value: state?.he,
            isValid: true,
        },
        {
            name: "Arabic",
            label: "Arabic",
            type: "text",
            // placeholder: "customers.modal.mobile",
            required: false,
            parameterKey: "ar",
            options: [],
            value: state?.ar,
            isValid: true,
        },

        
    ];
}
export { inputs};