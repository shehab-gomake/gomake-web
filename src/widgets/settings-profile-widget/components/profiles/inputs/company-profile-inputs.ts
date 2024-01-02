import { ICompanyProfile } from "@/store/company-profile";


const companyProfileInputs = (state: ICompanyProfile, currencies) => {

    return [
        {
            name: "businessName",
            label: "profileSettings.businessName",
            type: "text",
            placeholder: "profileSettings.businessName",
            required: true,
            parameterKey: "name",
            options: [],
            value: state.name,
            isValid: !!state.name,
        },
        {
            name: "dashboardCode",
            label: "profileSettings.dashboardCode",
            type: "text",
            placeholder: "profileSettings.dashboardCode",
            required: true,
            parameterKey: "dashboardCode",
            options: [],
            value: state.dashboardCode,
            isValid: !!state.dashboardCode,
        },
        {
            name: "System Currency",
            label: "profileSettings.systemCurrency",
            type: "select",
            placeholder: "profileSettings.systemCurrency",
            required: false,
            parameterKey: "systemCurrency",
            options: currencies.map(currency => ({
                value: currency.value,
                text: currency.value
            })),
            // optionsUrl: "/v1/enum/get-enums/currency",
            value: state?.systemCurrency,
            isValid: true,
        },
    ];
}

export { companyProfileInputs };