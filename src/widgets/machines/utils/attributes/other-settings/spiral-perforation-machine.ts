const spiralPerforationMachine = (state: Record<string, any>) => {
    return [
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

export {spiralPerforationMachine};