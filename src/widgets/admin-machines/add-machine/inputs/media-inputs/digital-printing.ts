const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "adminAddMachine.setupTimeMin",
            type: "text",
            placeholder: "setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            options: [],
            value: state?.attributes?.setupTimeMin ? state?.attributes?.setupTimeMin : '',
            machineInputType: 'input'
        },
        {
            name: "coatingUnit",
            label: "adminAddMachine.coatingUnit",
            type: "select",
            placeholder: "Media coating unit",
            required: true,
            parameterKey: "coatingUnit",
            value: state["coatingUnit"],
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input'
        },
        {
            name: "coatingUnitCost",
            label: "adminAddMachine.coatingUnitCost",
            type: "text",
            placeholder: "Cost for meter^2",
            required: state['coatingUnitCost'],
            parameterKey: "coatingUnitCost",
            options: [],
            disabled: !state["coatingUnit"],
            value: state?.attributes?.coatingUnitCost ? state?.attributes?.coatingUnitCost : '',
            machineInputType: 'input'
        },
        {
            name: 'Media Dimensions',
            parameterKey: 'mediaDimensions',
            machineInputType: 'multiInput',
            inputs: [
                {
                    name: "",
                    label: "Min width",
                    type: "text",
                    placeholder: "Min width",
                    required: true,
                    parameterKey: "minWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minWidth ? state.attributes?.mediaDimensions?.minWidth : ''

                },
                {
                    name: "",
                    label: "Min length",
                    type: "text",
                    placeholder: "Min length",
                    required: true,
                    parameterKey: "minLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minLength ? state.attributes?.mediaDimensions?.minLength : ''

                },
                {
                    name: "",
                    label: "Max width",
                    type: "text",
                    placeholder: "Max width",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxWidth ? state.attributes?.mediaDimensions?.maxWidth : ''

                },
                {
                    name: "",
                    label: "Max length",
                    type: "text",
                    placeholder: "Max length",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxLength ? state.attributes?.mediaDimensions?.maxLength : ''

                },
            ]
        },
        {
            name: 'Minimal margin without printing',
            parameterKey: 'minMarginWithoutPrinting',
            machineInputType: 'multiInput',
            inputs: [
                {
                    name: "minMarginWithoutPrinting",
                    label: "width",
                    type: "text",
                    placeholder: "width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.minMarginWithoutPrinting?.width ? state.attributes?.minMarginWithoutPrinting?.width : ''

                },
                {
                    name: "maxMediaDimensions",
                    label: "length",
                    type: "text",
                    placeholder: "length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.minMarginWithoutPrinting?.length ? state.attributes?.minMarginWithoutPrinting?.length  : ''

                },
            ]
        },
        {
            name: 'Media Weight ',
            parameterKey: 'mediaWeight',
            machineInputType: 'multiInput',
            inputs: [
                {
                    name: "",
                    label: "min",
                    type: "text",
                    placeholder: "Min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaWeight?.min ? state.attributes?.mediaWeight?.min : ''

                },
                {
                    name: "",
                    label: "max",
                    type: "text",
                    placeholder: "Max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaWeight?.max ? state.attributes?.mediaWeight?.max : ''

                },
            ]
        },

        {
            name: 'Media thickness ',
            parameterKey: 'mediaThickness',
            machineInputType: 'multiInput',
            inputs: [
                {
                    name: "",
                    label: "min",
                    type: "text",
                    placeholder: "Min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaThickness?.min ? state.attributes?.mediaThickness?.min : ''

                },
                {
                    name: "",
                    label: "max",
                    type: "text",
                    placeholder: "Max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaThickness?.max ? state.attributes?.mediaThickness?.max : ''

                },
            ]
        },
    ]
}


export {digitalPrinting};