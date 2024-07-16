import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const flatbedCuttingMachine = (state: Record<string, any>) => {
    return [
        ...mediaSheetLossInput(state),
        {
            name: "minWidthMarginCutting",
            label: "machineAttributes.minWidthMarginCutting",
            type: "text",
            placeholder: "machineAttributes.minWidthMarginCutting",
            required: true,
            parameterKey: "minWidthMarginCutting",
            value: state?.attributes?.minWidthMarginCutting,
            options: [],
            machineInputType: 'input',
            isValid: !!state?.attributes?.minWidthMarginCutting,
            unit: EMeasurementUnits.MM
        },
        {
            name: "shape",
            label: "machineAttributes.shape",
            type: "select",
            placeholder: "machineAttributes.shape",
            required: true,
            parameterKey: "shape",
            options: [],
            value: state?.attributes?.shape,
            optionsUrl: '/v1/print-house-config/parameters/shape',
            multiple: true
        },
        {
            name: 'machineAttributes.tableDimensions',
            parameterKey: 'tableDimensions',
            machineInputType: 'multiInput',
            value: state?.attributes?.tableDimensions,
            isValid: !!state?.attributes?.tableDimensions?.width &&
                !!state?.attributes?.tableDimensions?.length &&
                !!state?.attributes?.tableDimensions?.thickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.tableDimensions?.width ? state.attributes?.tableDimensions?.width : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.tableDimensions?.length ? state.attributes?.tableDimensions?.length : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    value: state.attributes?.tableDimensions?.thickness ? state.attributes?.tableDimensions?.thickness : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: '',
            parameterKey: 'sheetCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.sheetCategories ? state.attributes?.sheetCategories : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.sheetsAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.sheetsAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.sheetCategories?.isAvailable ? state.attributes?.sheetCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.sheetCategories?.categories,
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=sheets',
                    multiple: true,
                    disabled: !state.attributes?.sheetCategories?.isAvailable
                },
            ]
        },
        {
            name: '',
            parameterKey: 'wideFormatCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.wideFormatCategories ? state.attributes?.wideFormatCategories : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.wideFormatAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.wideFormatAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.wideFormatCategories?.isAvailable ? state.attributes?.wideFormatCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.wideFormatCategories?.categories,
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=wideFormatMaterial',
                    multiple: true,
                    disabled: !state.attributes?.wideFormatCategories?.isAvailable
                },
            ]
        },
        {
            name: '',
            parameterKey: 'flatbedsCategories',
            machineInputType: 'multiInput',
            value: state.attributes?.flatbedsCategories ? state.attributes?.flatbedsCategories : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.flatbedsAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.flatbedsAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.flatbedsCategories?.isAvailable ? state.attributes?.flatbedsCategories?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.flatbedsCategories?.categories,
                    optionsUrl: '/v1/materials/get-material-categories-list?materialKey=flatbeds',
                    multiple: true,
                    disabled: !state.attributes?.flatbedsCategories?.isAvailable
                },
            ]
        },
    ]
}


export {flatbedCuttingMachine};