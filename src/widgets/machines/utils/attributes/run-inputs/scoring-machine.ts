
const scoringMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.scoring',
            parameterKey: 'scoring',
            machineInputType: 'multiInput',
            value: state.attributes?.scoring ? state.attributes?.scoring : {},
            isValid: !!state?.attributes?.scoring?.maxLength &&
                !!state?.attributes?.scoring?.maxWidth,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.scoringAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.scoringAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.scoring?.isAvailable ? state.attributes?.scoring?.isAvailable : ''
                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.scoring?.maxLength ? state.attributes?.scoring?.maxLength : '',
                    disabled: !state.attributes?.scoring?.isAvailable
                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.scoring?.maxWidth ? state.attributes?.scoring?.maxWidth : '',
                    disabled: !state.attributes?.scoring?.isAvailable

                },
            ]
        },
        {
            name: 'machineAttributes.perforation',
            parameterKey: 'perforation',
            machineInputType: 'multiInput',
            value: state.attributes?.perforation ? state.attributes?.perforation : {},
            isValid: !!state?.attributes?.perforation?.maxLength &&
                !!state?.attributes?.perforation?.maxWidth,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.perforationAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.perforationAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.perforation?.isAvailable ? state.attributes?.perforation?.isAvailable : '',

                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.perforation?.maxLength ? state.attributes?.perforation?.maxLength : '',
                    disabled: !state.attributes?.perforation?.isAvailable


                },
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.perforation?.maxWidth ? state.attributes?.perforation?.maxWidth : '',
                    disabled: !state.attributes?.perforation?.isAvailable


                },
            ]
        },
        {
            name: "headsInRun",
            label: "machineAttributes.headsInRun",
            type: "text",
            placeholder: "machineAttributes.headsInRun",
            required: true,
            parameterKey: "headsInRun",
            options: [],
            value: state.attributes?.headsInRun ? state.attributes?.headsInRun : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.headsInRun,
        },
    ]
}

export {scoringMachine};