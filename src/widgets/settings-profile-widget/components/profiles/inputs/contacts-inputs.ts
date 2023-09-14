import {IUserProfile} from "@/store/user-profile";


const contactsInputs = (state: IUserProfile)  => {
    return [
        {
            name: "email",
            label: "profileSettings.email",
            type: "text",
            placeholder: "profileSettings.email",
            required: true,
            parameterKey: "email",
            options: [],
            value: state.email,
            machineInputType: 'input',
            isValid: !!state.email,
        },
        {
            name: "phone",
            label: "profileSettings.phone",
            type: "text",
            placeholder: "profileSettings.phone",
            required: true,
            parameterKey: "phoneNumber",
            options: [],
            value: state.phoneNumber,
            machineInputType: 'input',
            isValid: !!state.phoneNumber,
        },

    ];
}

export {contactsInputs};