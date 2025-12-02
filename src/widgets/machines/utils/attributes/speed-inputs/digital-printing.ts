import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {printingGeneral} from "@/widgets/machines/utils/attributes/speed-inputs/printing-general";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "machineAttributes.setupTimeMin",
            type: "text",
            placeholder: "machineAttributes.setupTimeMin",
            required: true,
            parameterKey: "setupTimeMin",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state.attributes?.setupTimeMin ? state.attributes?.setupTimeMin : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTimeMin,
        },
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            unit: EMeasurementUnits.PPM,
            parameterKey: "maxSpeed",
            options: [],
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
    {
        name: "doubleHead",
        label: "machineAttributes.doubleHead",
        type: "switch",
        placeholder: "machineAttributes.doubleHead",
        required: true,
        parameterKey: "doubleHead",
        value: state.attributes?.doubleHead,
        options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
        machineInputType: 'input',
        isValid: true,
    },
    {
        name: 'machineAttributes.speedBySheetCategories',
        parameterKey: 'speedBySheetCategories',
        value: state.attributes?.speedBySheetCategories || [],
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
            {
                name: "speed",
                label: "machineAttributes.speed",
                type: "text",
                placeholder: "machineAttributes.speed",
                required: true,
                parameterKey: "speed",
                unit: EMeasurementUnits.PERCENTAGE,
                options: []
            },
        ]
    },
    ...printingGeneral(state)
    ]
}

export {digitalPrinting};

