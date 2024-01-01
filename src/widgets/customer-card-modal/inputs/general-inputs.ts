
const generalInputs = (state) => {
    return [
        {
            name: "phone1",
            label: "customers.modal.phone",
            type: "phone",
            placeholder: "customers.modal.phone",
            required: false,
            parameterKey: "tel1",
            options: [],
            value: state?.tel1,
            isValid: true,
        },
        
        {
            name: "mainContactName",
            label: "customers.modal.mainContactName",
            type: "text",
            placeholder: "customers.modal.mainContactName",
            required: false,
            parameterKey: "mainContactName",
            options: [],
            value: state?.mainContactName,
            isValid: true,
        },
        {
            name: "mobile",
            label: "customers.modal.mobile",
            type: "phone",
            placeholder: "customers.modal.mobile",
            required: false,
            parameterKey: "phone",
            options: [],
            value: state?.phone,
            isValid: true,
        },
        {
            name: "clientLang",
            label: "customers.modal.language",
            type: "select",
            placeholder: "customers.modal.language",
            required: false,
            parameterKey: "clientLang",
            options: [],
            optionsUrl: "/v1/enum/get-enums/languages",
            value: state?.clientLang,
            isValid: true,
        },
    ];
}


const generalInputs2 = (typeClient , state) => {
    return [
        {
            name: "mail",
            label: "customers.modal.email",
            type: "text",
            placeholder: "customers.modal.email",
            required: false,
            parameterKey: "mail",
            options: [],
            value: state?.mail,
            isValid: true,
        },
        {
            name: "fax",
            label: "customers.modal.fax",
            type: "text",
            placeholder: "customers.modal.fax",
            required: false,
            parameterKey: "fax",
            options: [],
            value: state?.fax,
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
        
        {
            name: "isActive",
            label: "customers.modal.active",
            type: "switch",
            placeholder: "customers.modal.active",
            required: false,
            parameterKey: "isActive",
            options: [],
            value: state?.isActive,
            isValid: true,
        },
        {
            name: "isOccasional",
            label: "customers.modal.anOccasionalCustomer",
            type: "switch",
            placeholder: "customers.modal.anOccasionalCustomer",
            required: false,
            parameterKey: "isOccasional",
            options: [],
            value: state?.isOccasional,
            isValid: true,
            disabled: typeClient == "S" ? true : false
        },

    ];
}

const lastOrderInputs = (state) => {
    return [
        {
            name: "lastOrderContactName",
            label: "customers.modal.name",
            type: "text",
            placeholder: "customers.modal.name",
            required: false,
            parameterKey: "lastOrderContactName",
            options: [],
            value: state?.lastOrderContactName,
            isValid: true,
        },
        {
            name: "lastOrderContactPhone",
            label: "customers.modal.phone",
            type: "text",
            placeholder: "customers.modal.phone",
            required: false,
            parameterKey: "lastOrderContactPhone",
            options: [],
            value: state?.lastOrderContactPhone,
            isValid: true,
        },
        {
            name: "lastOrderContactMail",
            label: "customers.modal.email",
            type: "text",
            placeholder: "customers.modal.email",
            required: false,
            parameterKey: "lastOrderContactMail",
            options: [],
            value: state?.lastOrderContactMail,
            isValid: true,
        },
        {
            name: "lastOrderContactAddress",
            label: "customers.modal.address",
            type: "text",
            placeholder: "customers.modal.address",
            required: false,
            parameterKey: "lastOrderContactAddress",
            options: [],
            value: state?.lastOrderContactAddress,
            isValid: true,
        },
    ];
}

export { generalInputs, generalInputs2 , lastOrderInputs};