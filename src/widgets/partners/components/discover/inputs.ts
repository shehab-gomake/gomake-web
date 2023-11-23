const discoverInputs = (state) =>{
    return [
        {
            name: "Categories",
            type: "select",
            placeholder: "Categories",
            required: false,
            parameterKey: "categories",
            options: [],
            value: state?.categories,
        },
        {
            name: "Sub category",
            type: "select",
            placeholder: "Sub category",
            required: false,
            parameterKey: "subCategory",
            options: [],
            value: state?.subCategory,
        },
        {
            name: "Status",
            type: "select",
            placeholder: "Status",
            required: false,
            parameterKey: "status",
            options: [],
            value: state?.status,
        },
        {
            name: "Date",
            type: "select",
            placeholder: "Date",
            required: false,
            parameterKey: "date",
            options: [],
            value: state?.date,
        },
    ];
};


export { discoverInputs };