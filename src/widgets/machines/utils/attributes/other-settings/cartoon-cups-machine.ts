
const cartoonCupsMachine = (state: Record<string, any>) => {
    return [
        {
            name: "dieCuts",
            label: "machineAttributes.dieCuts",
            type: "select",
            placeholder: "machineAttributes.dieCuts",
            required: true,
            parameterKey: "dieCuts",
            values: state?.price?.dieCuts ? state?.price?.dieCuts : 0,
            options: [],
            isValid: true,
            optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=DieCut',
            multiple: true,
        },
    ]
}

export {cartoonCupsMachine};