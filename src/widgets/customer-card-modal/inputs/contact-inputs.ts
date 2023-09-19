
const contactInputs1 = (state)  => {
    return [
        {
            name: "firstName",
            label: "customers.modal.firstName",
            type: "text",
            placeholder: "customers.modal.firstName",
            required: false,
            parameterKey: "firstName",
            options: [],
            value: state?.firstName,
            isValid: true,
        },
        {
            name: "lastName",
            label: "customers.modal.lastName",
            type: "text",
            placeholder: "customers.modal.lastName",
            required: false,
            parameterKey: "lastName",
            options: [],
            value: state?.lastName,
            isValid: true,
        },
        {
            name: "title",
            label: "customers.modal.title",
            type: "text",
            placeholder: "customers.modal.title",
            required: false,
            parameterKey: "title",
            options: [],
            value: state?.title,
            isValid: true,
        },
        {
            name: "role",
            label: "customers.modal.role",
            type: "text",
            placeholder: "customers.modal.role",
            required: false,
            parameterKey: "position",
            options: [],
            value: state?.position,
            isValid: true,
        },
        {
            name: "address",
            label: "customers.modal.address",
            type: "text",
            placeholder: "customers.modal.address",
            required: false,
            parameterKey: "address",
            options: [],
            value: state?.address,
            isValid: true,
        },
    ];
}

const contactInputs2 = (state)  => {
    return [
        {
            name: "phone1",
            label: "customers.modal.phone1",
            type: "text",
            placeholder: "customers.modal.phone1",
            required: false,
            parameterKey: "tel1",
            options: [],
            value: state?.tel1,
            isValid: true,
        },
        {
            name: "phone2",
            label: "customers.modal.phone2",
            type: "text",
            placeholder: "customers.modal.phone2",
            required: false,
            parameterKey: "tel2",
            options: [],
            value: state?.tel2,
            isValid: true,
        },
        {
            name: "mobile",
            label: "customers.modal.mobile",
            type: "text",
            placeholder: "customers.modal.mobile",
            required: false,
            parameterKey: "phone",
            options: [],
            value: state?.phone,
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
            name: "email",
            label: "customers.modal.email",
            type: "text",
            placeholder: "customers.modal.email",
            required: false,
            parameterKey: "mail",
            options: [],
            value: state?.mail,
            isValid: true,
        }
        
    ];
}
export { contactInputs1 , contactInputs2};