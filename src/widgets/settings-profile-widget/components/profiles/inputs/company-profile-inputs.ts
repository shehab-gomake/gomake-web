import {ICompanyProfile} from "@/store/company-profile";


const companyProfileInputs = (state: ICompanyProfile)  => {
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
    ];
}

export {companyProfileInputs};