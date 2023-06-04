const rollDigitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            options: [],
            value: state?.attributes?.setupTimeMin ? state?.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "coatingUnit",
            label: "machineAttributes.coatingUnit",
            type: "select",
            placeholder: "machineAttributes.coatingUnit",
            required: true,
            parameterKey: "coatingUnit",
            value: state?.attributes?.coatingUnit,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "coatingUnitCost",
            label: "machineAttributes.coatingUnitCost",
            type: "text",
            placeholder: "machineAttributes.coatingUnitCost",
            required: state?.coatingUnitCost,
            parameterKey: "coatingUnitCost",
            options: [],
            disabled: !state?.attributes?.coatingUnit,
            value: state?.attributes?.coatingUnit && state?.attributes?.coatingUnitCost ? state?.attributes?.coatingUnitCost : '',
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: 'machineAttributes.mediaDimensions',
            parameterKey: 'mediaDimensions',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaDimensions?.minWidth &&
                !!state?.attributes?.mediaDimensions?.minLength &&
                !!state?.attributes?.mediaDimensions?.maxWidth &&
                !!state?.attributes?.mediaDimensions?.maxLength ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.minWidth",
                    type: "text",
                    placeholder: "machineAttributes.minWidth",
                    required: true,
                    parameterKey: "minWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minWidth ? state.attributes?.mediaDimensions?.minWidth : ''
                },
                {
                    name: "",
                    label: "machineAttributes.minLength",
                    type: "text",
                    placeholder: "machineAttributes.minLength",
                    required: true,
                    parameterKey: "minLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.minLength ? state.attributes?.mediaDimensions?.minLength : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxWidth ? state.attributes?.mediaDimensions?.maxWidth : ''

                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.mediaDimensions?.maxLength ? state.attributes?.mediaDimensions?.maxLength : ''

                },
            ]
        },
        {
            name: 'machineAttributes.minMarginWithoutPrinting',
            parameterKey: 'minMarginWithoutPrinting',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.minMarginWithoutPrinting?.width &&
                !!state?.attributes?.minMarginWithoutPrinting?.length  ,
            inputs: [
                {
                    name: "minMarginWithoutPrinting",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.minMarginWithoutPrinting?.width ? state.attributes?.minMarginWithoutPrinting?.width : ''

                },
                {
                    name: "maxMediaDimensions",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.minMarginWithoutPrinting?.length ? state.attributes?.minMarginWithoutPrinting?.length  : ''

                },
            ]
        },
        {
            name: 'machineAttributes.mediaWeight',
            parameterKey: 'mediaWeight',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaWeight?.min &&
                !!state?.attributes?.mediaWeight?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaWeight?.min ? state.attributes?.mediaWeight?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaWeight?.max ? state.attributes?.mediaWeight?.max : ''

                },
            ]
        },

        {
            name: 'machineAttributes.mediaThickness',
            parameterKey: 'mediaThickness',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.mediaThickness?.min &&
                !!state?.attributes?.mediaThickness?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaThickness?.min ? state.attributes?.mediaThickness?.min : ''

                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaThickness?.max ? state.attributes?.mediaThickness?.max : ''
                },
            ]
        },
    ]
}


export {rollDigitalPrinting};