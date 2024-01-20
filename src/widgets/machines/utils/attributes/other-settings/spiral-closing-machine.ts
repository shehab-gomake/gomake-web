const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        {
            name: "spiralType",
            label: "machineAttributes.spiralType",
            type: "select",
            placeholder: "machineAttributes.spiralType",
            required: true,
            parameterKey: "spiralType",
            options: [],
            values: state?.attributes?.spiralType,
            optionsUrl: '/v1/materials/GetMaterialTypeTableHeader?materialKey=spiral&headerName=type',
            multiple: true
        },
        {
            name: "spiralCategories",
            label: "machineAttributes.spiralCategories",
            type: "select",
            placeholder: "machineAttributes.spiralCategories",
            required: true,
            parameterKey: "spiralCategories",
            options: [],
            values: state?.attributes?.spiralCategories,
            optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=spiral',
            multiple: true
        },
        {
            name: "pitch",
            label: "machineAttributes.pitch",
            type: "select",
            placeholder: "machineAttributes.pitch",
            required: true,
            parameterKey: "pitch",
            options: [],
            values: state?.attributes?.pitch,
            optionsUrl: '/v1/materials/GetMaterialTypeTableHeader?materialKey=spiral&headerName=pitch',
            multiple: true
        },
    ];
}

export {spiralClosingMachine};