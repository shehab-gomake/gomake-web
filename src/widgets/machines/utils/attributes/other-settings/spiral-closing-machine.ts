import {
    spiralTypeCategoriesInputs
} from "@/widgets/machines/utils/attributes/other-settings/spiral-type-categories-inputs";

const spiralClosingMachine = (state: Record<string, any>) => {
    return [
        ...spiralTypeCategoriesInputs(state),
        {
            name: "pitch",
            label: "machineAttributes.pitch",
            type: "select",
            placeholder: "machineAttributes.pitch",
            required: true,
            parameterKey: "pitch",
            options: [],
            value: state?.attributes?.pitch,
            optionsUrl: '/v1/materials/GetMaterialTypeTableHeader?materialKey=spiral&headerName=pitch',
            multiple: true
        },
    ];
}

export {spiralClosingMachine};