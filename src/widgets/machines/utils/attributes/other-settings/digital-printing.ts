const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "available",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "printOverLaminateIsAvailable",
            options: [],
            value: state.attributes?.printOverLaminateIsAvailable ? state.attributes?.printOverLaminateIsAvailable : ''
        },
        {
            name: "machineAttributes.foilOverLayColor",
            label: "machineAttributes.color",
            type: "text",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "foilOverLayColor",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.foilOverLayColor,
            isValid: true,
            materialType: 'colors',
            disabled: !state.attributes?.printOverLaminateIsAvailable
        },
        {
            name: "machineAttributes.scratchFoilOverlayColor",
            label: "machineAttributes.color",
            type: "text",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "scratchFoilOverlayColor",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.scratchFoilOverlayColor,
            isValid: true,
            materialType: 'colors',
            disabled: !state.attributes?.printOverLaminateIsAvailable
        },
    ];
}

export {digitalPrinting};