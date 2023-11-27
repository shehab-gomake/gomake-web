const discoverInputs = (state) => {

    const statuses = [{ text: "Active", value: "true" }, { text: "Inactive", value: "false" }];
   
    const dates = [
        { text: "Today", value: "2023-11-25" },
        { text: "Tomorrow", value: "2023-11-26" },
        { text: "Next Week", value: "2023-12-02" },
    ];

    const categories = [
        { text: "Products", value: "products" },
        { text: "Printing house", value: "printingHouse" },
        { text: "Machine", value: "machine" },
        { text: "Location", value: "location" },
        { text: "Action", value: "action" },
    ];

    const subCategories = [
        { text: "Die cut", value: "dieCut" },
        { text: "Role slickers", value: "roleSlickers" },
        { text: "Labels", value: "labels" },
        { text: "Paper products", value: "paperProducts" },
        { text: "Book cover", value: "bookCover" },
    ];

    return [
        {
            name: "Categories",
            type: "select",
            placeholder: "Categories",
            required: false,
            parameterKey: "categories",
            options: categories,
            value: state?.categories,
        },
        {
            name: "Sub category",
            type: "select",
            placeholder: "Sub category",
            required: false,
            parameterKey: "subCategory",
            options: subCategories,
            value: state?.subCategory,
        },
        {
            name: "Status",
            type: "select",
            placeholder: "Status",
            required: false,
            parameterKey: "status",
            options: statuses,
            value: state?.status,
        },
        {
            name: "Date",
            type: "select",
            placeholder: "Date",
            required: false,
            parameterKey: "date",
            options: dates,
            value: state?.date,
        },
    ];
};


export { discoverInputs };