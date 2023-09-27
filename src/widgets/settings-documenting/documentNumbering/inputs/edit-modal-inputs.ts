
const editDocumentInputs = (state: any) => {
    return [
        {
            name: "Name",
            label: "documentingSettings.name",
            type: "text",
            placeholder: "documentingSettings.name",
            required: false,
            parameterKey: "documentName",
            options: [],
            value: state.documentName,
            isValid: true,
        },
        {
            name: "Value",
            label: "documentingSettings.value",
            type: "text",
            placeholder: "documentingSettings.value",
            required: false,
            parameterKey: "value",
            options: [],
            value: state.value,
            isValid: true,
        },
    ]
}
export { editDocumentInputs };