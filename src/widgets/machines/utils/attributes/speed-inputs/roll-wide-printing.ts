import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";

const rollWidePrinting = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.SQUARE_METER_P_HOUR),
        {
            name: "unitDelay",
            label: "machineAttributes.loadingDelay",
            type: "text",
            placeholder: "machineAttributes.loadingDelay",
            required: true,
            parameterKey: "unitDelay",
            options: [],
            value: state?.attributes?.unitDelay ? state?.attributes?.unitDelay : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.unitDelay,
            unit: EMeasurementUnits.MINUTE
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
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=sheets',
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
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: false,
                    parameterKey: "thickness",
                    options: [],
                    value: state.attributes?.pvc?.maxThickness ? state.attributes?.pvc?.maxThickness : '',
                    unit: EMeasurementUnits.MM
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
                    required: false,
                    parameterKey: "categories",
                    options: [],
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=wideFormatMaterial',
                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    value: state.attributes?.pvc?.maxThickness ? state.attributes?.pvc?.maxThickness : '',
                    unit: EMeasurementUnits.UM
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