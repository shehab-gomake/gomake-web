import {IUserProfile} from "@/store/user-profile";


const personalInputs = (state: IUserProfile)  => {
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
        },

    ];
}

export {personalInputs};