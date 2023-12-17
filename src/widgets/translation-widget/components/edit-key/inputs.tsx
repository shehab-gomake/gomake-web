const inputs = (state)  => {
    return [
        {
            name: "path",
            label: "Path",
            type: "text",
            required: false,
            parameterKey: "path",
            options: [],
            value: state?.path,
            isValid: true,
            readonly: true
        },
        {
            name: "Key",
            label: "Key",
            type: "text",
            required: false,
            parameterKey: "key",
            options: [],
            value: state?.key,
            isValid: true,
          //  readonly: true
        },
        {
            name: "English",
            label: "English",
            type: "text",
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
            required: false,
            parameterKey: "he",
            options: [],
            value: state?.he,
            isValid: true,
            readonly: false
        },
        {
            name: "Arabic",
            label: "Arabic",
            type: "text",
            required: false,
            parameterKey: "ar",
            options: [],
            value: state?.ar,
            isValid: true,
            readonly: false
        },

        
    ];
}
export { inputs};