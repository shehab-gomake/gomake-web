import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const sheetsCategoriesList = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.sheetsCategories',
            parameterKey: 'sheetsCategories',
            value: state.attributes?.sheetsCategories || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=sheets',
                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: false,
                    parameterKey: "thickness",
                    options: [],
                    unit: EMeasurementUnits.UM,
                    isValid: true
                },
            ]
        },
    ]
}


export {sheetsCategoriesList};