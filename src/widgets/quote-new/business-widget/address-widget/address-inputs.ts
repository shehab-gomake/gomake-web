const addressInputs = (state: any, cities: any[], filteredCityStreets: any[]) => {
    return [
        {
            name: "city",
            label: "sales.quote.city",
            type: "select",
            placeholder: "sales.quote.city",
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
            label: "sales.quote.street",
            type: "select",
            placeholder: "sales.quote.street",
            required: false,
            parameterKey: "street",
            options: filteredCityStreets.map(street => ({
                value: street.name,
                text: street.name,
            })),
            value: state?.street,
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