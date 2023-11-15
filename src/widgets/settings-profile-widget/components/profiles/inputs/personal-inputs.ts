import {IUserProfile} from "@/store/user-profile";
import {useRecoilValue} from "recoil";
import {languagesState} from "@/store/languages";


const personalInputs = (state: IUserProfile)  => {
    const languages = useRecoilValue(languagesState);
    return [
        {
            name: "firstName",
            label: "profileSettings.firstName",
            type: "text",
            placeholder: "profileSettings.firstName",
            required: true,
            parameterKey: "firstName",
            options: [],
            value: state.firstName,
            machineInputType: 'input',
            isValid: !!state.firstName,
            readonly: false

        },
        {
            name: "lastName",
            label: "profileSettings.lastName",
            type: "text",
            placeholder: "profileSettings.lastName",
            required: true,
            parameterKey: "lastName",
            options: [],
            value: state.lastName,
            machineInputType: 'input',
            isValid: !!state.lastName,
            readonly: false

        },
        {
            name: "position",
            label: "profileSettings.position",
            type: "text",
            placeholder: "profileSettings.position",
            required: true,
            parameterKey: "position",
            options: [],
            value: state.role,
            machineInputType: 'input',
            isValid: !!state.role,
            readonly: false
        },
        {
            name: "systemLang",
            label: "profileSettings.systemLanguage",
            type: "select",
            placeholder: "profileSettings.systemLanguage",
            required: true,
            parameterKey: "systemLang",
            options: languages,
            value: state.systemLang,
            isValid: !!state.systemLang,
            readonly: false
        },

    ];
}

export {personalInputs};