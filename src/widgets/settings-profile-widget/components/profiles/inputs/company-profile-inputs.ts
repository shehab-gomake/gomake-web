import { UNIT_TYPE } from "@/enums/tabs-icon-enums";
import { ICompanyProfile } from "@/store/company-profile";
import { useTranslation } from "react-i18next";


const companyProfileInputs = (state: ICompanyProfile, currencies) => {
    const { t } = useTranslation();
    const unitTypeOptions = [
        { value: UNIT_TYPE.UNITS, text: t("profileSettings.units") },
        { value: UNIT_TYPE.IMPERIAL, text: t("profileSettings.imperial") },
    ];



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
            name: "businessNumber",
            label: "profileSettings.businessNumber",
            type: "number",
            placeholder: "profileSettings.businessNumber",
            required: false,
            parameterKey: "business_ID",
            options: [],
            value: state.business_ID,
            isValid: state?.business_ID?.length >= 9,
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
                text: currency.label
            })),
            // optionsUrl: "/v1/enum/get-enums/currency",
            value: state?.systemCurrency,
            isValid: true,
        },
        {
            name: "employeeWorkingHourCost",
            label: "profileSettings.employeeWorkingHourCost",
            type: "number",
            placeholder: "profileSettings.employeeWorkingHourCost",
            required: false,
            parameterKey: "employeeWorkingHourCost",
            options: [],
            value: state.employeeWorkingHourCost,
            isValid: !!state.employeeWorkingHourCost,
        },
        {
            name: "unitType",
            label: "profileSettings.unitsType",
            type: "select",
            placeholder: "profileSettings.unitsType",
            required: false,
            parameterKey: "unitType",
            options: unitTypeOptions,
            value: state.unitType,
            isValid: true,


        },
    ];
}

export { companyProfileInputs };