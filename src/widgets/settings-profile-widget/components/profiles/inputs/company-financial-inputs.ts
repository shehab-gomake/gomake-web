import {ICompanyProfile} from "@/store/company-profile";


const companyFinancialInputs = (state: ICompanyProfile)  => {
    return [
        {
            name: "accountCode",
            label: "profileSettings.accountCode",
            type: "text",
            placeholder: "profileSettings.accountCode",
            required: true,
            parameterKey: "accountCode",
            options: [],
            value: state.accountCode,
            machineInputType: 'input',
            isValid: !!state.accountCode,
        },
        {
            name: "bankReference",
            label: "profileSettings.bankReference",
            type: "text",
            placeholder: "profileSettings.bankReference",
            required: true,
            parameterKey: "bankReference",
            options: [],
            value: state.bankReference,
            machineInputType: 'input',
            isValid: !!state.bankReference,
        },
        {
            name: "depositAccount",
            label: "profileSettings.depositAccount",
            type: "text",
            placeholder: "profileSettings.depositAccount",
            required: true,
            parameterKey: "depositAccount",
            options: [],
            value: state.depositAccount,
            machineInputType: 'input',
            isValid: !!state.depositAccount,
        },
        {
            name: "depositor",
            label: "profileSettings.depositor",
            type: "text",
            placeholder: "profileSettings.depositor",
            required: true,
            parameterKey: "depositor",
            options: [],
            value: state.depositor,
            machineInputType: 'input',
            isValid: !!state.depositor,
        },
        {
            name: "depositBranch",
            label: "profileSettings.depositBranch",
            type: "text",
            placeholder: "profileSettings.depositBranch",
            required: true,
            parameterKey: "depositBranch",
            options: [],
            value: state.depositBranch,
            machineInputType: 'input',
            isValid: !!state.depositBranch,
        },

    ];
}

export {companyFinancialInputs};