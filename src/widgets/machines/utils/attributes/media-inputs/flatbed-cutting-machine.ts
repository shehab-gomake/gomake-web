import {mediaSheetLossInput} from "@/widgets/machines/utils/attributes/media-inputs/media-sheet-loss-input";

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
        },
        {
            name: 'machineAttributes.tableDimensions',
            parameterKey: 'tableDimensions',
            machineInputType: 'multiInput',
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
                    value: state.attributes?.tableDimensions?.width ? state.attributes?.tableDimensions?.width : ''
                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.tableDimensions?.length ? state.attributes?.tableDimensions?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    value: state.attributes?.tableDimensions?.thickness ? state.attributes?.tableDimensions?.thickness : ''

                },
            ]
        },
    ]
}


export {flatbedCuttingMachine};