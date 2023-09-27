
const creationDocumetInputs = (state)  => {
    return [
        {
            name: "documentType",
            label: "documentingDesign.documnetCreation.docmentType",
            type: "select",
            placeholder: "documentingDesign.documnetCreation.docmentType",
            required: true,
            parameterKey: "docmentId",
            options: [],
            optionsUrl: "",
            value: state?.documentType,
            isValid: true,
        },
        {
            name: "agent",
            label: "customers.modal.agent",
            type: "select",
            placeholder: "customers.modal.agent",
            required: false,
            parameterKey: "agentId",
            options: [],
            optionsUrl: "/v1/employee/get-all-agents",
            value: state?.agentId,
            isValid: true,
        },
       
    ];

};
const TitleDefinitionInputs = (state)  => {
    return [
        {
            name: "Business name",
            label: "documentingDesign.TitleDefinition.BusinessName",
            type: "text",
            placeholder: "documentingDesign.TitleDefinition.BusinessName",
            required: false,
            parameterKey: "BusinessName",
            value: state?.BusinessName,
            isValid: true,
        },
        {
            name: "H.P./authorizedDealer",
            label: "documentingDesign.TitleDefinition.H.P./authorizedDealer",
            type: "text",
            placeholder: "documentingDesign.TitleDefinition.H.P./authorizedDealer",
            required: false,
            parameterKey: "H.P./authorizedDealer",
            value: state?.authorizedDealer,
            isValid: true,
        },
        {
            name: "Logo Upload",
            label: "documentingDesign.TitleDefinition.LogoUpload",
            type: "file",
            placeholder: "documentingDesign.TitleDefinition.LogoUpload",
            required: false,
            parameterKey: "LogoUpload",
            value: state?.authorizedDealer,
            isValid: true,
        },
       
    ];

};


export {creationDocumetInputs , TitleDefinitionInputs };