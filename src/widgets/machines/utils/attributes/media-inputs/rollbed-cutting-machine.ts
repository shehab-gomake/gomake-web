const rollbedCuttingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "mediaLossMeter",
            label: "machineAttributes.mediaLossMeter",
            type: "text",
            placeholder: "machineAttributes.mediaLossMeter",
            required: true,
            parameterKey: "mediaLossMeter",
            value: state?.attributes?.mediaLossMeter,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.mediaLossMeter,
        },
        {
            name: "minWidthMarginCutting",
            label: "machineAttributes.minWidthMarginCutting",
            type: "text",
            placeholder: "machineAttributes.minWidthMarginCutting",
            required: true,
            parameterKey: "minWidthMarginCutting",
            value: state?.attributes?.minWidthMarginCutting,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.minWidthMarginCutting,
        },
        {
            name: 'machineAttributes.media',
            parameterKey: 'media',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.media?.width &&
                !!state?.attributes?.media?.length &&
                !!state?.attributes?.media?.thickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.media?.width ? state.attributes?.media?.width : ''
                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.media?.length ? state.attributes?.media?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    value: state.attributes?.media?.thickness ? state.attributes?.media?.thickness : ''

                },
            ]
        },
    ]
}


export {rollbedCuttingMachine};