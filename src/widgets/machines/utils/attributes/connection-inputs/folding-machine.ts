import {CURRENCY} from "@/widgets/machines/utils/const/currency";

const foldingMachine = (state: Record<string, any>) => {
    return [
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

export {foldingMachine};