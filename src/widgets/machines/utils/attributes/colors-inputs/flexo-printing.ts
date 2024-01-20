import {basicColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/basic-colors-input";

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
        ...basicColorsInput(state),

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
            name: "machineAttributes.colors",
            label: "machineAttributes.color",
            type: "text",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "colors",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.colors,
            isValid: true,
            materialType: 'colors'
        },
        {
            name: "machineAttributes.varnish",
            label: "machineAttributes.varnish",
            type: "text",
            placeholder: "machineAttributes.varnish",
            required: true,
            parameterKey: "varnish",
            options: [],
            disabled: !state?.attributes?.varnish,
            machineInputType: 'materialInput',
            value: state?.attributes?.varnish,
            isValid: true,
            materialType: 'varnish'
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