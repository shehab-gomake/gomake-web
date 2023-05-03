import {CURRENCY} from "@/widgets/admin-machines/const/currency";

const machineInputs = (state: Record<string, any>)  => {
    return [
        {
            name: "manufacturer",
            label: "machineAttributes.manufacturer",
            type: "text",
            placeholder: "machineAttributes.manufacturer",
            required: true,
            parameterKey: "manufacturer",
            options: [],
            value: state?.manufacturer ? state?.manufacturer : '',
            machineInputType: 'input',
            isValid: !!state.manufacturer,
        },
        {
            name: "model",
            label: "machineAttributes.model",
            type: "text",
            placeholder: "machineAttributes.model",
            required: true,
            parameterKey: "model",
            options: [],
            value: state?.model ? state?.model : '',
            machineInputType: 'input',
            isValid: !!state.model,
        },
        {
            name: "code",
            label: "machineAttributes.code",
            type: "text",
            placeholder: "machineAttributes.code",
            required: true,
            parameterKey: "code",
            options: [],
            value: state?.code ? state?.code : '',
            machineInputType: 'input',
            isValid: !!state.code,
        },
        {
            name: "nickName",
            label: "machineAttributes.nickName",
            type: "text",
            placeholder: "machineAttributes.nickName",
            required: true,
            parameterKey: "nickName",
            options: [],
            value: state?.nickName ? state?.nickName : '',
            machineInputType: 'input',
            isValid: !!state.nickName,
        },
        {
            machineInputType: 'multiInput',
            name: 'machineAttributes.price',
            parameterKey: 'price',
            isValid: !!state?.price?.price,
            value: state?.price,
            inputs: [
                {
                    name: "price",
                    label: "machineAttributes.price",
                    type: "text",
                    placeholder: "machineAttributes.price",
                    required: true,
                    parameterKey: "price",
                    options: [],
                    value: state?.price?.price ? state.price.price : '',
                    isValid: !!state?.price?.price,
                },
                {
                    name: "currency",
                    label: "machineAttributes.currency",
                    type: "select",
                    placeholder: "machineAttributes.currency",
                    required: true,
                    parameterKey: "currency",
                    value: state?.price?.currency ? state?.price?.currency : 0,
                    options: CURRENCY,
                    isValid: true,
                },
            ]
        }

    ];
}

export {machineInputs};