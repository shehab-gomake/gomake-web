import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.blanketDimensions',
            parameterKey: 'blanketDimensions',
            machineInputType: 'multiInput',
            value: state?.attributes?.blanketDimensions,
            isValid: !!state?.attributes?.blanketDimensions?.length &&
                !!state?.attributes?.blanketDimensions?.width &&
                !!state?.attributes?.blanketDimensions?.thickness,
            inputs: [
                {
                    name: "length",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state?.attributes?.blanketDimensions?.length ? state?.attributes?.blanketDimensions?.length : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "width",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state?.attributes?.blanketDimensions?.width ? state?.attributes?.blanketDimensions?.width : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "thickness",
                    label: "machineAttributes.thickness",
                    type: "text",
                    placeholder: "machineAttributes.thickness",
                    required: true,
                    parameterKey: "thickness",
                    options: [],
                    value: state?.attributes?.blanketDimensions?.thickness ? state?.attributes?.blanketDimensions?.thickness : '',
                    unit: EMeasurementUnits.MM

                },
            ]
        },
        {
            name: 'machineAttributes.packingSheet',
            parameterKey: 'packingSheet',
            machineInputType: 'multiInput',
            value: state?.attributes?.packingSheet,
            isValid: !!state?.attributes?.packingSheet?.length &&
                !!state?.attributes?.packingSheet?.width,
            inputs: [
                {
                    name: "length",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.packingSheet?.length ? state.attributes?.packingSheet?.length : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "width",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.packingSheet?.width ? state.attributes?.packingSheet?.width : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
    ]
}


export {ofssetPrinting};