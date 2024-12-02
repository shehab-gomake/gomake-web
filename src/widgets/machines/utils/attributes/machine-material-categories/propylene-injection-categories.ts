
const propyleneInjectionCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'propyleneTool',
            machineInputType: 'multiInput',
            value: state.attributes?.propyleneTool ? state.attributes?.propyleneTool : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.propyleneTool",
                    type: "switch",
                    placeholder: "machineAttributes.propyleneTool",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.propyleneTool?.isAvailable ? state.attributes?.propyleneTool?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.propyleneTool?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=Propylene',
                    multiple: true,
                    disabled: !state.attributes?.propyleneTool?.isAvailable
                },
                // {
                //     name: "glueType",
                //     label: "machineAttributes.propyleneType",
                //     type: "select",
                //     placeholder: "machineAttributes.propyleneType",
                //     required: true,
                //     parameterKey: "categories",
                //     options: [],
                //     value: state?.attributes?.propyleneTool?.propyleneType,
                //     optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=cut',
                //     multiple: true,
                //     disabled: !state.attributes?.propyleneTool?.isAvailable
                // },
            ]
        },
    ]
}


export {propyleneInjectionCategories};