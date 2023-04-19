const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "basicsColors",
            label: "adminAddMachine.basicsColors",
            type: "select",
            placeholder: "Basics colors",
            required: true,
            parameterKey: "basicsColors",
            value: state?.attributes?.basicsColors ? state?.attributes?.basicsColors : '',
            options: [{value: 1, text: 'Black'}, {value: 2, text: 'CMYK'}],
            machineInputType: 'input',
        },

        {
            name: "additionalColorsAmount",
            label: "adminAddMachine.additionalColorsAmount",
            type: "text",
            placeholder: "Colors number",
            required: true,
            parameterKey: "additionalColorsAmount",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.additionalColorsAmount ? state?.attributes?.additionalColorsAmount : ''
        },
        {
            name: "printLayers",
            label: "adminAddMachine.printLayers",
            type: "select",
            placeholder: "Option to print layers",
            required: true,
            parameterKey: "printLayers",
            value: state?.attributes?.printLayers ? state?.attributes?.printLayers : '',
            options:  [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
        },
        {
            name: "printLayersSameRun",
            label: "adminAddMachine.printLayersSameRun",
            type: "select",
            placeholder: "Option to print same run",
            required: true,
            parameterKey: "printLayersSameRun",
            value: state["printLayersSameRun"],
            options:  [{value: null, text: ''}, {value: false, text: 'No'}, {value: true, text: 'Yes'}],
            disabled: !state?.attributes?.printLayers,
            machineInputType: 'input',
        },
        {
            name: "printLayersMax",
            label: "adminAddMachine.printLayersMax",
            type: "text",
            placeholder: "Maximum layers",
            required: true,
            parameterKey: "printLayersMax",
            options: [],
            disabled: !state?.attributes?.printLayers,
            machineInputType: 'input',
            value: state?.attributes?.printLayersMax


        },
        {
            name: 'Additional colors',
            parameterKey: 'additionalColorsCoast',
            value: state?.attributes?.additionalColorsCoast ? state?.attributes?.additionalColorsCoast : [],
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "color",
                    label: "adminAddMachine.color",
                    type: "select",
                    placeholder: "Color",
                    required: true,
                    parameterKey: "color",
                    options:  [{value: 1, text: 'White'}, {value: 2, text: 'Gold'}, {value: 3, text: 'Silver'}, {value: 4, text: 'Cyan'}, {value: 5, text: 'Magenta'}]
                },
                {
                    name: "cost",
                    label: "adminAddMachine.cost",
                    type: "text",
                    placeholder: "Coast",
                    required: true,
                    parameterKey: "cost",
                    options: []
                },

            ]
        },
    ]
};


export {digitalPrinting}