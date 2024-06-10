import {ICompanyProfile} from "@/store/company-profile";
import {IPrintHouseLocation} from "@/store/print-house-locations-state";


const companyLocationInputs = (state: ICompanyProfile | IPrintHouseLocation , countriesWithCodes)  => {
    return [
        {
            name: "country",
            label: "profileSettings.country",
            type: "select",
            placeholder: "profileSettings.country",
            required: true,
            parameterKey: "country",
            options: countriesWithCodes,
            value: state?.country,
            machineInputType: 'input',
            isValid: !!state.country,
        },
        {
            name: "city",
            label: "profileSettings.city",
            type: "text",
            placeholder: "profileSettings.city",
            required: true,
            parameterKey: "city",
            options: [],
            value: state.city,
            machineInputType: 'input',
            isValid: !!state.city,
        },
        {
            name: "street",
            label: "profileSettings.street",
            type: "text",
            placeholder: "profileSettings.street",
            required: true,
            parameterKey: "street",
            options: [],
            value: state.street,
            machineInputType: 'input',
            isValid: !!state.street,
        },
        {
            name: "streetNumber",
            label: "profileSettings.streetNumber",
            type: "text",
            placeholder: "profileSettings.streetNumber",
            required: true,
            parameterKey: "streetNumber",
            options: [],
            value: state.streetNumber,
            machineInputType: 'input',
            isValid: !!state.streetNumber,
        },
        {
            name: "zipCode",
            label: "profileSettings.zipCode",
            type: "text",
            placeholder: "profileSettings.zipCode",
            required: true,
            parameterKey: "zipCode",
            options: [],
            value: state.zipCode,
            machineInputType: 'input',
            isValid: !!state.zipCode,
        },
        {
            name: "po",
            label: "profileSettings.po",
            type: "text",
            placeholder: "profileSettings.po",
            required: true,
            parameterKey: "po",
            options: [],
            value: state.po,
            machineInputType: 'input',
            isValid: !!state.po,
        },
    ];
}

export {companyLocationInputs};