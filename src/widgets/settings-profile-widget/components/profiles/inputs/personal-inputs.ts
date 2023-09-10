import {IUserProfile} from "@/widgets/settings-profile-widget/components/profiles/interface";


const personalInputs = (state: IUserProfile)  => {
    return [
        {
            name: "fullName",
            label: "profileSettings.fullName",
            type: "text",
            placeholder: "profileSettings.fullName",
            required: true,
            parameterKey: "fullName",
            options: [],
            value: state.fullName,
            machineInputType: 'input',
            isValid: !!state.fullName,
        },
        {
            name: "companyName",
            label: "profileSettings.companyName",
            type: "text",
            placeholder: "profileSettings.companyName",
            required: true,
            parameterKey: "companyName",
            options: [],
            value: state.companyName,
            machineInputType: 'input',
            isValid: !!state.companyName,
        },
        {
            name: "position",
            label: "profileSettings.position",
            type: "text",
            placeholder: "profileSettings.position",
            required: true,
            parameterKey: "position",
            options: [],
            value: state.position,
            machineInputType: 'input',
            isValid: !!state.position,
        },
        {
            name: "demoCode",
            label: "profileSettings.demoCode",
            type: "text",
            placeholder: "profileSettings.demoCode",
            required: true,
            parameterKey: "demoCode",
            options: [],
            value: state.demoCode,
            machineInputType: 'input',
            isValid: !!state.demoCode,
        },
    ];
}

export {personalInputs};