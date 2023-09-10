import {IUserProfile} from "@/widgets/settings-profile-widget/components/profiles/interface";


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
            parameterKey: "phone",
            options: [],
            value: state.phone,
            machineInputType: 'input',
            isValid: !!state.phone,
        },
        {
            name: "address",
            label: "profileSettings.address",
            type: "text",
            placeholder: "profileSettings.address",
            required: true,
            parameterKey: "address",
            options: [],
            value: state.address,
            machineInputType: 'input',
            isValid: !!state.address,
        },
        {
            name: "postalCode",
            label: "profileSettings.postalCode",
            type: "text",
            placeholder: "profileSettings.postalCode",
            required: true,
            parameterKey: "postalCode",
            options: [],
            value: state.postalCode,
            machineInputType: 'input',
            isValid: !!state.postalCode,
        },
    ];
}

export {contactsInputs};