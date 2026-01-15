import {ICompanyProfile} from "@/store/company-profile";
import {IInput} from "@/components/form-inputs/interfaces";


const companyIntegrationsInputs = (state: ICompanyProfile): IInput[] => {
    return [
        {
            name: "hpHmac",
            label: "profileSettings.hpHmac",
            type: "text",
            placeholder: "profileSettings.hpHmac",
            required: false,
            parameterKey: "hpHmac",
            options: [],
            value: state.hpHmac,
            isValid: true,
        },
    ] as IInput[];
}

export {companyIntegrationsInputs};
