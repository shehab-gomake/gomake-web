
const customerInputs = (state)  => {
    return [
        {
            name: "code",
            label: "customers.modal.code",
            type: "text",
            placeholder: "customers.modal.code",
            required: true,
            parameterKey: "code",
            options: [],
            value: state?.code,
            isValid: true,
            readonly: true,
        },
        {
            name: "name",
            label: "customers.modal.clientName",
            type: "text",
            placeholder: "customers.modal.clientName",
            required: true,
            parameterKey: "name",
            options: [],
            value: state?.name,
            isValid: true,
        },
        {
            name: "buisnessNumber",
            label: "customers.modal.vatNO",
            type: "text",
            placeholder: "customers.modal.vatNO",
            required: false,
            parameterKey: "buisnessNumber",
            options: [],
            value: state?.buisnessNumber,
            isValid: true,
         },
        // {
        //     name: "clientTypeId",
        //     label: "customers.modal.clientType",
        //     type: "select",
        //     placeholder: "customers.modal.clientType",
        //     required: true,
        //     parameterKey: "clientTypeId",
        //     options: [],
        //     optionsUrl:"/v1/crm-service/clients/get-all-client-types",
        //     value: state?.clientTypeId,
        //     isValid: true,
        // },
        {
            name: "Currency",
            label: "customers.modal.code",
            type: "select",
            placeholder: "customers.modal.code",
            required: false,
            parameterKey: "currency",
            options: [],
            optionsUrl:"/v1/enum/get-enums/currency",
            value: state?.currency,
            isValid: true,
        },
        {
            name: "cpaClientCode",
            label: "customers.modal.CPAcode",
            type: "text",
            placeholder: "customers.modal.CPAcode",
            required: false,
            parameterKey: "cpaClientCode",
            options: [],
            value: state?.cpaClientCode,
            isValid: true,
        },
    ];
}

export {customerInputs};