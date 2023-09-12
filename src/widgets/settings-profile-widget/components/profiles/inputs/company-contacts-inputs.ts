import {ICompanyProfile} from "@/store/user-profile";


const companyContactsInputs = (state: ICompanyProfile)  => {
    return [
        {
            name: "email1",
            label: "profileSettings.email1",
            type: "text",
            placeholder: "profileSettings.email1",
            required: true,
            parameterKey: "email1",
            options: [],
            value: state.email1,
            machineInputType: 'input',
            isValid: !!state.email1,
        },
        {
            name: "email2",
            label: "profileSettings.email2",
            type: "text",
            placeholder: "profileSettings.email2",
            required: true,
            parameterKey: "email2",
            options: [],
            value: state.email2,
            machineInputType: 'input',
            isValid: !!state.email2,
        },
        {
            name: "phone1",
            label: "profileSettings.phone1",
            type: "text",
            placeholder: "profileSettings.phone1",
            required: true,
            parameterKey: "phone1",
            options: [],
            value: state.phone1,
            machineInputType: 'input',
            isValid: !!state.phone1,
        },
        {
            name: "phone2",
            label: "profileSettings.phone2",
            type: "text",
            placeholder: "profileSettings.phone2",
            required: true,
            parameterKey: "phone2",
            options: [],
            value: state.phone2,
            machineInputType: 'input',
            isValid: !!state.phone2,
        },
        {
            name: "mobile",
            label: "profileSettings.mobile",
            type: "text",
            placeholder: "profileSettings.mobile",
            required: true,
            parameterKey: "mobile",
            options: [],
            value: state.tW_WA_PhoneNumber,
            machineInputType: 'input',
            isValid: !!state.tW_WA_PhoneNumber,
        },
    ];
}

export {companyContactsInputs};