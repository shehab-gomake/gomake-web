const spiralTypeCategoriesInputs = (state: Record<string, any>) => {
    return [
        {
            name: "spiralType",
            label: "machineAttributes.spiralType",
            type: "select",
            placeholder: "machineAttributes.spiralType",
            required: true,
            parameterKey: "spiralType",
            options: [],
            value: state?.attributes?.spiralType,
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
            value: state?.attributes?.spiralCategories,
            optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=spiral',
            multiple: true
        },
    ];
}

export {spiralTypeCategoriesInputs};