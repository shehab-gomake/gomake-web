import { useTranslation } from "react-i18next";

const discoverInputs = (state , t) => {

    const statuses = [{ text: t("partners.options.active"), value: "true" }, { text: t("partners.options.inActive"), value: "false" }];
   
    const dates = [
        { text: t("partners.options.today"), value: "2023-11-25" },
        { text: t("partners.options.tomorrow"), value: "2023-11-26" },
        { text: t("partners.options.nextWeek"), value: "2023-12-02" },
    ];

    const categories = [
        { text: t("partners.options.products"), value: "products" },
        { text: t("partners.options.printingHouse"), value: "printingHouse" },
        { text: t("partners.options.machine"), value: "machine" },
        { text: t("partners.options.location"), value: "location" },
        { text: t("partners.options.action"), value: "action" },
    ];

    const subCategories = [
        { text: t("partners.options.dieCut"), value: "dieCut" },
        { text: t("partners.options.roleSlickers"), value: "roleSlickers" },
        { text: t("partners.options.labels"), value: "labels" },
        { text: t("partners.options.paperProducts"), value: "paperProducts" },
        { text: t("partners.options.bookCover"), value: "bookCover" },
    ];

    return [
        {
            name: "Categories",
            type: "select",
            placeholder: "partners.categories",
            required: false,
            parameterKey: "categories",
            options: categories,
            value: state?.categories,
        },
        {
            name: "Sub category",
            type: "select",
            placeholder: "partners.subCategory",
            required: false,
            parameterKey: "subCategory",
            options: subCategories,
            value: state?.subCategory,
        },
        {
            name: "Status",
            type: "select",
            placeholder: "partners.status",
            required: false,
            parameterKey: "status",
            options: statuses,
            value: state?.status,
        },
        {
            name: "Date",
            type: "select",
            placeholder: "partners.date",
            required: false,
            parameterKey: "date",
            options: dates,
            value: state?.date,
        },
    ];
};


export { discoverInputs };