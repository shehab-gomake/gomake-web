import {ICompanyProfile} from "@/store/company-profile";


const companyPrintNodeInputs = (state: ICompanyProfile)  => {
    return [
        {
            name: "printnodeUsername",
            label: "profileSettings.printnodeUsername",
            type: "text",
            placeholder: "profileSettings.printnodeUsername",
            required: true,
            parameterKey: "printnodeUsername",
            options: [],
            value: state.printnodeUsername,
            machineInputType: 'input',
            isValid: !!state.printnodeUsername,
        },
        {
            name: "printnodePassword",
            label: "profileSettings.printnodePassword",
            type: "password",
            placeholder: "profileSettings.printnodePassword",
            required: true,
            parameterKey: "printnodePassword",
            options: [],
            value: state.printnodePassword,
            machineInputType: 'input',
            isValid: !!state.printnodePassword,
        },
    ];
}

export {companyPrintNodeInputs};