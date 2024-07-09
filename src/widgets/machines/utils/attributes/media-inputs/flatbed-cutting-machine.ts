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
            optionsUrl: '/v1/print-house-config/parameters/shape-complexity',
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
    ]
}


export {flatbedCuttingMachine};