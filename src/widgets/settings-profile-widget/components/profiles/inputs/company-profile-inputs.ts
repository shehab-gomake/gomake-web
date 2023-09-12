import {ICompanyProfile} from "@/store/user-profile";


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
            machineInputType: 'input',
            isValid: !!state.name,
        },
        {
            name: "dashboardCode",
            label: "profileSettings.dashboardCode",
            type: "text",
            placeholder: "profileSettings.dashboardCode",
            required: true,
            parameterKey: "email2",
            options: [],
            value: state.dashboardCode,
            machineInputType: 'input',
            isValid: !!state.dashboardCode,
        },
    ];
}

export {companyProfileInputs};