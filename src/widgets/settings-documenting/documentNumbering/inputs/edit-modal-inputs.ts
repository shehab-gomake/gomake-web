import { IDocument } from "../interface/document";

const editDocumentInputs = (state: IDocument) => {
    return [
        {
            name: "documentName",
            label: "documentingSettings.name",
            type: "text",
            placeholder: "documentingSettings.name",
            required: false,
            readonly: true,
            parameterKey: "documentName",
            options: [],
            value: state.documentName,
            isValid: true,
        },
        {
            name: "value",
            label: "documentingSettings.value",
            type: "number",
            placeholder: "documentingSettings.value",
            required: false,
            parameterKey: "value",
            options: [],
            value: state.value,
            isValid: true,
        },
    ]
}

const editDocumentInputs1 = (state: IDocument) => {
    return [
        {
            name: "Prefix",
            label: "documentingSettings.prefix",
            type: "text",
            placeholder: "documentingSettings.prefix",
            required: false,
            parameterKey: "prefix",
            options: [],
            value: state.prefix,
            isValid: true,
        }
    ]
}
export { editDocumentInputs , editDocumentInputs1 };