import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "currency",
            label: "machineAttributes.currency",
            type: "select",
            placeholder: "machineAttributes.currency",
            required: true,
            parameterKey: "beatsCurrency",
            options: [],
            isValid: true,
            value: state?.attributes?.beatsCurrency,
            optionsUrl: '/v1/enum/get-enums/currency'
        },
        {
            name: 'machineAttributes.beatByColorsBySize',
            parameterKey: 'beats',
            value: state?.attributes?.beats ? state?.attributes?.beats : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.beats?.length > 0,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.color",
                    type: "text",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: "color",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.mediaLength",
                    type: "text",
                    placeholder: "machineAttributes.mediaLength",
                    required: true,
                    unit: EMeasurementUnits.CM,
                    parameterKey: "mediaLength",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.cost",
                    type: "text",
                    placeholder: "machineAttributes.cost",
                    required: true,
                    parameterKey: "cost",
                    options: []
                },
            ]
        },
    ]
};

export {digitalPrinting};