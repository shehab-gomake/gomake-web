const addressInputs1 = (state, cities, filteredCityStreets) => {
    return [
        {
            name: "addressId",
            label: "customers.modal.addressId",
            type: "text",
            placeholder: "customers.modal.addressId",
            required: true,
            parameterKey: "address1",
            options: [],
            value: state?.address1,
            isValid: true,
        },
        {
            name: "city",
            label: "customers.modal.city",
            type: "select",
            placeholder: "customers.modal.city",
            required: false,
            parameterKey: "city",
            options: cities.map(city => ({
                value: city.Name,
                text: city.Name
            })),
            value: state?.city,
        },
        {
            name: "street",
            label: "customers.modal.street",
            type: "select",
            placeholder: "customers.modal.street",
            required: false,
            parameterKey: "street",
            options: filteredCityStreets.map(street => ({
                value: street.name,
                text: street.name,
            })),
            value: state?.street,
        },
        {
            name: "home",
            label: "customers.modal.home",
            type: "text",
            placeholder: "customers.modal.home",
            required: false,
            parameterKey: "homeNumber",
            options: [],
            value: state?.homeNumber,
            isValid: true,
        },
        {
            name: "entrance",
            label: "customers.modal.entrance",
            type: "text",
            placeholder: "customers.modal.entrance",
            required: false,
            parameterKey: "entry",
            options: [],
            value: state?.entry,
            isValid: true,
        },
    ];
}

export { addressInputs1 };