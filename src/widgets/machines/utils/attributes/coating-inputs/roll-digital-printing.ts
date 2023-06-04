
const rollDigitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "coatingUnitNumber",
            label: "machineAttributes.coatingUnit",
            type: "text",
            placeholder: "machineAttributes.coatingUnit",
            required: true,
            parameterKey: "coatingUnitNumber",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingUnitNumber ? state?.attributes?.coatingUnitNumber : '',
            isValid: !!state?.attributes?.coatingUnitNumber
        },
        {
            name: "coatingCost",
            label: "machineAttributes.coatingCost",
            type: "text",
            placeholder: "machineAttributes.coatingCost",
            required: true,
            parameterKey: "coatingCost",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingCost ? state?.attributes?.coatingCost : '',
            isValid: !!state?.attributes?.coatingCost
        },
        {
            name: 'machineAttributes.coatingBlanket',
            parameterKey: 'coatingBlanket',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.coatingBlanket?.length &&
                !!state?.attributes?.coatingBlanket?.width ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.coatingBlanket?.length ? state.attributes?.coatingBlanket?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.coatingBlanket?.width ? state.attributes?.coatingBlanket?.width : ''

                },
            ]
        },
        {
            name: 'machineAttributes.coatingPlate',
            parameterKey: 'coatingPlate',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.coatingPlate?.length &&
                !!state?.attributes?.coatingPlate?.width ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.coatingPlate?.length ? state.attributes?.coatingPlate?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.coatingPlate?.width ? state.attributes?.coatingPlate?.width : ''

                },
            ]
        },
        {
            name: 'machineAttributes.maxCoatingArea',
            parameterKey: 'maxCoatingArea',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.maxCoatingArea?.length &&
                !!state?.attributes?.maxCoatingArea?.width ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.maxCoatingArea?.length ? state.attributes?.maxCoatingArea?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.maxCoatingArea?.width ? state.attributes?.maxCoatingArea?.width : ''

                },
            ]
        },
        {
            name: "machineAttributes.cylinderUndercut",
            label: "machineAttributes.cylinderUndercut",
            type: "text",
            placeholder: "machineAttributes.cylinderUndercut",
            required: true,
            parameterKey: "coatingCylinderUndercut",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingCylinderUndercut ? state?.attributes?.coatingCylinderUndercut : '',
            isValid: !!state?.attributes?.coatingCylinderUndercut
        },
        {
            name: "Distance from lead edge",
            label: "machineAttributes.coatingDistance",
            type: "text",
            placeholder: "machineAttributes.coatingDistance",
            required: true,
            parameterKey: "coatingDistance",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingDistance ? state?.attributes?.coatingDistance : '',
            isValid: !!state?.attributes?.coatingDistance
        },
    ]
};


export {rollDigitalPrinting}