import {COLORS} from "@/widgets/machines/utils/const";

const flexoPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "numberOfPrintingUnits",
            label: "machineAttributes.numberOfPrintingUnits",
            type: "text",
            placeholder: "machineAttributes.numberOfPrintingUnits",
            required: true,
            parameterKey: "numberOfPrintingUnits",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.numberOfPrintingUnits ? state?.attributes?.numberOfPrintingUnits : '',
            isValid: !!state?.attributes?.numberOfPrintingUnits
        },
        {
            name: "basicsColors",
            label: "machineAttributes.basicsColors",
            type: "select",
            placeholder: "machineAttributes.basicsColors",
            required: true,
            parameterKey: "basicsColors",
            value: state?.attributes?.basicsColors,
            options: [{value: 1, text: 'Black'}, {value: 2, text: 'CMYK'}],
            machineInputType: 'input',
            isValid: true
        },

        {
            name: "amountColorStations",
            label: "machineAttributes.amountColorStations",
            type: "text",
            placeholder: "machineAttributes.amountColorStations",
            required: true,
            parameterKey: "amountColorStations",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.amountColorStations ? state?.attributes?.amountColorStations : '',
            isValid: true
        },
        {
            name: "fIfthStation",
            label: "machineAttributes.fIfthStation",
            type: "text",
            placeholder: "machineAttributes.fIfthStation",
            required: true,
            parameterKey: "fIfthStation",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.fIfthStation,
            isValid: !!state?.attributes?.fIfthStation

        },
        {
            name: 'varnish',
            parameterKey: 'varnish',
            value: state?.attributes?.varnish ? state?.attributes?.varnish : [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "color",
                    label: "machineAttributes.color",
                    type: "select",
                    placeholder: "machineAttributes.color",
                    required: true,
                    parameterKey: "color",
                    value: COLORS[0].value,
                    options:  COLORS
                },
                {
                    name: "cost",
                    label: "machineAttributes.cost",
                    type: "text",
                    placeholder: "machineAttributes.cost",
                    required: true,
                    parameterKey: "cost",
                    options: []
                },

            ]
        },
        {
            name: "pantoon",
            label: "machineAttributes.pantoon",
            type: "text",
            placeholder: "machineAttributes.pantoon",
            required: true,
            parameterKey: "pantoon",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.pantoon,
            isValid: !!state?.attributes?.pantoon

        },

    ]
};


export {flexoPrinting}