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
            readonly: true
        },
        {
            name: "phone",
            label: "profileSettings.phone",
            type: "phone",
            placeholder: "profileSettings.phone",
            required: false,
            parameterKey: "phoneNumber",
            options: [],
            value: state.phoneNumber,
            machineInputType: 'input',
            isValid: !!state.phoneNumber,
            readonly: true

        },

    ];
}

export {contactsInputs};