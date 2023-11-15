const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.spiralType',
            parameterKey: 'spiralType',
            value: state.attributes?.spiralType || [],
            isValid: state.attributes?.spiralType?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "structure",
                    label: "machineAttributes.structure",
                    type: "text",
                    placeholder: "machineAttributes.structure",
                    required: true,
                    parameterKey: "structure",
                    options: []
                },
                {
                    name: "material",
                    label: "machineAttributes.materials",
                    type: "text",
                    placeholder: "machineAttributes.materials",
                    required: true,
                    parameterKey: "material",
                    options: []
                },
                {
                    name: "spiralType",
                    label: "machineAttributes.spiralType",
                    type: "text",
                    placeholder: "machineAttributes.spiralType",
                    required: true,
                    parameterKey: "spiralType",
                    options: []
                },
                {
                    name: "calendarHanger",
                    label: "machineAttributes.calendarHanger",
                    type: "switch",
                    placeholder: "machineAttributes.calendarHanger",
                    required: true,
                    parameterKey: "calendarHanger",
                    value: false,
                    options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
                    machineInputType: 'input',
                    isValid: true,
                },
            ]
        }
    ];
}

export {spiralClosingMachine};