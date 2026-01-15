import {ICompanyProfile} from "@/store/company-profile";
import {IInput} from "@/components/form-inputs/interfaces";


const companyIntegrationsInputs = (state: ICompanyProfile): IInput[] => {
    return [
        {
            name: "hpHmacSecret",
            label: "profileSettings.hpHmacSecret",
            type: "text",
            placeholder: "profileSettings.hpHmacSecret",
            required: false,
            parameterKey: "hpHmacSecret",
            options: [],
            value: state.hpHmacSecret,
            isValid: true,
        },
        {
            name: "hpHmacKey",
            label: "profileSettings.hpHmacKey",
            type: "text",
            placeholder: "profileSettings.hpHmacKey",
            required: false,
            parameterKey: "hpHmacKey",
            options: [],
            value: state.hpHmacKey,
            isValid: true,
        },
    ] as IInput[];
}

export {companyIntegrationsInputs};
