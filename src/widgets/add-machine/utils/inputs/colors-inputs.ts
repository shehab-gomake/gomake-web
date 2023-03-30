const colorsInputs = (state: Record<string, any>) => {
    return [
        {
            name: "basicsColors",
            label: "adminAddMachine.basicsColors",
            type: "select",
            placeholder: "Basics colors",
            required: true,
            key: "basicsColors",
            value: state["basicsColors"],
            options: [{value: 1, text: 'Black'}, {value: 2, text: 'CMYK'}]
        },

        {
            name: "additionalColorsAmount",
            label: "adminAddMachine.additionalColorsAmount",
            type: "text",
            placeholder: "Colors number",
            required: true,
            key: "additionalColorsAmount",
            options: []
        },
        {
            name: "printLayers",
            label: "adminAddMachine.printLayers",
            type: "select",
            placeholder: "Option to print layers",
            required: true,
            key: "printLayers",
            value: state["printLayers"],
            options:  [{value: false, text: 'No'}, {value: true, text: 'Yes'}]
        },
        {
            name: "printLayersSameRun",
            label: "adminAddMachine.printLayersSameRun",
            type: "select",
            placeholder: "Option to print same run",
            required: true,
            key: "printLayersSameRun",
            value: state["printLayersSameRun"],
            options:  [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            disabled: !state["printLayers"]
        },
        {
            name: "printLayersMax",
            label: "adminAddMachine.printLayersMax",
            type: "text",
            placeholder: "Maximum layers",
            required: true,
            key: "printLayersMax",
            options: [],
            disabled: !state["printLayers"]
        },
    ]
};

const additionalColorsCostInputs = (state: Record<string, any>) => {
    return [    {
        name: 'Additional colors',
        key: 'additionalColorsCoast',
        value: state['additionalColorsCoast'] || [],
        inputs: [
            {
                name: "color",
                label: "adminAddMachine.color",
                type: "select",
                placeholder: "Color",
                required: true,
                key: "color",
                options:  [{value: 1, text: 'White'}, {value: 2, text: 'Gold'}, {value: 3, text: 'Silver'}, {value: 4, text: 'Cyan'}, {value: 5, text: 'Magenta'}]
            },
            {
                name: "cost",
                label: "adminAddMachine.cost",
                type: "text",
                placeholder: "Coast",
                required: true,
                key: "cost",
                options: []
            },

        ]
    },]
}

export {colorsInputs, additionalColorsCostInputs}