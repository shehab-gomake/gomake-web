const addressInputs = (state: any, cities: any[], filteredCityStreets: any[]) => {
    return [
        {
            name: "Address Line 1",
            label: "sales.quote.addressLine1",
            type: "text",
            placeholder: "sales.quote.enterYourAddress",
            required: false,
            parameterKey: "address1",
            options: [],
            value: state?.address1,
            isValid: true,
        },
        {
            name: "Address Line 2",
            label: "sales.quote.addressLine2",
            type: "text",
            placeholder: "sales.quote.enterYourAddress",
            required: false,
            parameterKey: "address2",
            options: [],
            value: state?.address2,
            isValid: true,
        },
        {
            name: "Country",
            label: "sales.quote.country",
            type: "select",
            placeholder: "sales.quote.selectYourCountry",
            required: false,
            parameterKey: "country",
            options: filteredCityStreets.map(street => ({
                value: street.name,
                text: street.name,
            })),
            value: state?.country,
        },
        {
            name: "city",
            label: "sales.quote.city",
            type: "select",
            placeholder: "sales.quote.selectYourCity",
            required: false,
            parameterKey: "city",
            options: cities.map(city => ({
                value: city.Name,
                text: city.Name
            })),
            value: state?.city,
        },
        {
            name: "Zip Code",
            label: "sales.quote.zipCode",
            type: "text",
            placeholder: "sales.quote.enterYourZipCode",
            required: false,
            parameterKey: "zipCode",
            options: [],
            value: state?.zipCode,
            isValid: true,
        },
    ];
}

export { addressInputs };