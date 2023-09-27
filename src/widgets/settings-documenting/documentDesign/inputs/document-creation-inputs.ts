
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


export {creationDocumetInputs };