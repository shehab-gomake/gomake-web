import {COLOR_TYPES} from "@/widgets/machines/utils/const";
import {basicColorsInput} from "@/widgets/machines/utils/attributes/colors-inputs/basic-colors-input";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "numberOfPrintingUnits",
            label: "machineAttributes.numberOfPrintingUnits",
            type: "text",
            placeholder: "machineAttributes.numberOfPrintingUnits",
            required: true,
            parameterKey: "printingUnits",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.printingUnits ? state?.attributes?.printingUnits : '',
            isValid: !!state?.attributes?.printingUnits
        },
        ...basicColorsInput(state),

        {
            name: "colorStations",
            label: "machineAttributes.colorStations",
            type: "text",
            placeholder: "machineAttributes.colorStations",
            required: true,
            parameterKey: "colorStations",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.colorStations ? state?.attributes?.colorStations : '',
            isValid: !!state?.attributes?.colorStations
        },
        {
            name: "fIfthStation",
            label: "machineAttributes.fifthStation",
            type: "text",
            placeholder: "machineAttributes.fifthStation",
            required: true,
            parameterKey: "fifthStation",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.fIfthStation ? state?.attributes?.fIfthStation : '',
            isValid: !!state?.attributes?.fIfthStation
        },
        {
            name: "varnish",
            label: "machineAttributes.varnish",
            type: "select",
            placeholder: "machineAttributes.varnish",
            required: true,
            parameterKey: "varnish",
            value: state?.attributes?.varnish,
            options:  [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true
        },
        {
            name: 'machineAttributes.varnishPrice',
            parameterKey: 'varnishPrice',
            value: state?.attributes?.varnishPrice ? state?.attributes?.varnishPrice : [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "color",
                    label: "machineAttributes.color",
                    type: "select",
                    placeholder: "Color",
                    required: true,
                    parameterKey: "color",
                    value: COLOR_TYPES[0],
                    options:  COLOR_TYPES
                },
                {
                    name: "price",
                    label: "machineAttributes.price",
                    type: "text",
                    placeholder: "machineAttributes.price",
                    required: true,
                    parameterKey: "price",
                    options: []
                },

            ]
        },
    ]
};


export {ofssetPrinting}