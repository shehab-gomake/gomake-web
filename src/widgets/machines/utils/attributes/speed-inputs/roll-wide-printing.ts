import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";

const rollWidePrinting = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.SQUARE_METER_P_HOUR),
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
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=sheets',
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
        {
            name: 'machineAttributes.speedByFlatbedsCategories',
            parameterKey: 'speedByFlatbedsCategories',
            value: state.attributes?.speedByFlatbedsCategories || [],
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
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=flatbeds',
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
        {
            name: 'machineAttributes.speedByWideFormatCategories',
            parameterKey: 'speedByWideFormatCategories',
            value: state.attributes?.speedByWideFormatCategories || [],
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
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=wideFormatMaterial',
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
        {
            name: 'machineAttributes.speedByWidth',
            parameterKey: 'speedByWidth',
            value: state.attributes?.speedByWidth || [],
            isValid: state.attributes?.speedByWidth?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "width",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    unit: EMeasurementUnits.CM,
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    unit: EMeasurementUnits.PERCENTAGE,
                    options: []
                },

            ]
        }
    ]
}

export {rollWidePrinting};