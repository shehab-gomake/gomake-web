
const addressInputs2 = (state)  => {
    return [
        {
            name: "floor",
            label: "customers.modal.floor",
            type: "text",
            placeholder: "customers.modal.floor",
            required: false,
            parameterKey: "floor",
            options: [],
            value: state?.floor,
            isValid: true,
        },
        {
            name: "apartment",
            label: "customers.modal.apartment",
            type: "text",
            placeholder: "customers.modal.apartment",
            required: false,
            parameterKey: "apartment",
            options: [],
            value: state?.apartment,
            isValid: true,
        },
        {
            name: "postalCode",
            label: "customers.modal.postalCode",
            type: "text",
            placeholder: "customers.modal.postalCode",
            required: false,
            parameterKey: "zipCode",
            options: [],
            value: state?.zipCode,
            isValid: true,
        },
        {
            name: "postbox",
            label: "customers.modal.po",
            type: "text",
            placeholder: "customers.modal.po",
            required: false,
            parameterKey: "postbox",
            options: [],
            value: state?.postbox,
            isValid: true,
        },
        {
            name: "country",
            label: "customers.modal.country",
            type: "text",
            placeholder: "customers.modal.country",
            required: false,
            parameterKey: "county",
            options: [],
            value: state?.county,
            isValid: true,
        },
    ];
}
const addressInputs3 = (state)  => {
    return [
        {
            name: "remarks",
            label: "customers.modal.remarks",
            type: "text",
            placeholder: "customers.modal.remarks",
            required: false,
            parameterKey: "notes",
            options: [],
            value: state?.notes,
            isValid: true,
        },
        {
            name: "default",
            label: "customers.modal.default",
            type: "switch",
            placeholder: "customers.modal.default",
            required: false,
            parameterKey: "isDefault",
            options: [],
            value: state?.isDefault,
            isValid: true,
        },
        
    ];
}




export { addressInputs2 , addressInputs3};