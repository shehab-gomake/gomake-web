const hardCoverMakingMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.boardThickness',
            parameterKey: 'boardThickness',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.boardThickness?.min &&
                !!state?.attributes?.boardThickness?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.boardThickness?.min ? state.attributes?.boardThickness?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.boardThickness?.max ? state.attributes?.boardThickness?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.caseHeight',
            parameterKey: 'caseHeight',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.caseHeight?.min &&
                !!state?.attributes?.caseHeight?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.caseHeight?.min ? state.attributes?.caseHeight?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.caseHeight?.max ? state.attributes?.caseHeight?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.caseWidth',
            parameterKey: 'caseWidth',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.caseWidth?.min &&
                !!state?.attributes?.caseWidth?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.caseWidth?.min ? state.attributes?.caseWidth?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.caseWidth?.max ? state.attributes?.caseWidth?.max : ''
                },
            ]
        },
        {
            name: 'machineAttributes.spineWidth',
            parameterKey: 'spineWidth',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.spineWidth?.min &&
                !!state?.attributes?.spineWidth?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.spineWidth?.min ? state.attributes?.spineWidth?.min : ''
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.spineWidth?.max ? state.attributes?.spineWidth?.max : ''
                },
            ]
        },
    ]
}


export {hardCoverMakingMachine};