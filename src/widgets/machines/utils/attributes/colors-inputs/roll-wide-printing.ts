import {digitalPrinting} from "@/widgets/machines/utils/attributes/colors-inputs/digital-printing";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const rollWidePrinting = (state: Record<string, any>) => {
    return [
        {
            name: "colorType",
            label: "machineAttributes.colorType",
            type: "select",
            placeholder: "machineAttributes.colorType",
            required: true,
            parameterKey: "colorType",
            value: state?.attributes?.colorType,
            options: [{value: '1', text: 'UV'}, {value: '2', text: 'Eco solvent'}, {value: '3', text: 'latex'}],
            machineInputType: 'input',
            isValid: true,
        },
        ...digitalPrinting(state),
        {
            name: 'machineAttributes.colorLoadBySheetCategories',
            parameterKey: 'colorLoadBySheetCategories',
            value: state.attributes?.colorLoadBySheetCategories || [],
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
                    name: "load",
                    label: "machineAttributes.load",
                    type: "text",
                    placeholder: "machineAttributes.load",
                    required: true,
                    parameterKey: "load",
                    unit: EMeasurementUnits.PERCENTAGE,
                    options: []
                },
            ]
        },
        {
            name: 'machineAttributes.colorLoadByWideFormatCategories',
            parameterKey: 'colorLoadByWideFormatCategories',
            value: state.attributes?.colorLoadByWideFormatCategories || [],
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
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=wideFormatMaterial',
                },
                {
                    name: "load",
                    label: "machineAttributes.load",
                    type: "text",
                    placeholder: "machineAttributes.load",
                    required: true,
                    parameterKey: "load",
                    unit: EMeasurementUnits.PERCENTAGE,
                    options: []
                },
            ]
        },
        {
            name: 'machineAttributes.colorLoadByFlatbedsCategories',
            parameterKey: 'colorLoadByFlatbedsCategories',
            value: state.attributes?.colorLoadByFlatbedsCategories || [],
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
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=flatbeds',
                },
                {
                    name: "load",
                    label: "machineAttributes.load",
                    type: "text",
                    placeholder: "machineAttributes.load",
                    required: true,
                    parameterKey: "load",
                    unit: EMeasurementUnits.PERCENTAGE,
                    options: []
                },
            ]
        },
    ]
};


export {rollWidePrinting}