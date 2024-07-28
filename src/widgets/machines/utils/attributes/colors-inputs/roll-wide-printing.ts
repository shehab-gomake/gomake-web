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
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=sheets',
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