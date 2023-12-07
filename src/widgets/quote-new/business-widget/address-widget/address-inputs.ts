const addressInputs = (state: any, cities: any[], filteredCityStreets: any[]) => {
    return [
        {
            name: "City",
            label: "sales.quote.city",
            type: "text",
            placeholder: "sales.quote.city",
            required: false,
            parameterKey: "city",
            options: [],
            value: state?.city,
            isValid: true,
        },
        {
            name: "Street",
            label: "sales.quote.street",
            type: "text",
            placeholder: "sales.quote.street",
            required: false,
            parameterKey: "street",
            options: [],
            value: state?.street,
            isValid: true,
        },
        {
            name: "entrance",
            label: "sales.quote.entrance",
            type: "text",
            placeholder: "sales.quote.entrance",
            required: false,
            parameterKey: "entry",
            options:[],
            value: state?.entry,
        },
        {
            name: "apartment",
            label: "sales.quote.apartment",
            type: "text",
            placeholder: "sales.quote.apartment",
            required: false,
            parameterKey: "apartment",
            options: [],
            value: state?.apartment,
        },
    ];
}

export { addressInputs };