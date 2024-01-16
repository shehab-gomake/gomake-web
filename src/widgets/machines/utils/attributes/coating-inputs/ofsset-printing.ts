import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "coatingUnit",
            label: "machineAttributes.coatingUnit",
            type: "switch",
            placeholder: "machineAttributes.coatingUnit",
            required: true,
            parameterKey: "coatingUnit",
            value: state?.attributes?.coatingUnit,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "coatingUnitNumber",
            label: "machineAttributes.coatingUnit",
            type: "text",
            placeholder: "machineAttributes.coatingUnit",
            required: true,
            parameterKey: "coatingUnitNumber",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingUnitNumber ? state?.attributes?.coatingUnitNumber : '',
            isValid: !!state?.attributes?.coatingUnitNumber,
            disabled: !state?.attributes?.coatingUnit
        },
        {
            name: "coatingCost",
            label: "machineAttributes.coatingCost",
            type: "text",
            placeholder: "machineAttributes.coatingCost",
            required: true,
            parameterKey: "coatingCost",
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingCost ? state?.attributes?.coatingCost : '',
            isValid: !!state?.attributes?.coatingCost,
            disabled: !state?.attributes?.coatingUnit

        },
        {
            name: "machineAttributes.cylinderUndercut",
            label: "machineAttributes.cylinderUndercut",
            type: "text",
            placeholder: "machineAttributes.cylinderUndercut",
            required: true,
            parameterKey: "coatingCylinderUndercut",
            unit: EMeasurementUnits.CM,
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingCylinderUndercut ? state?.attributes?.coatingCylinderUndercut : '',
            isValid: !!state?.attributes?.coatingCylinderUndercut,
            disabled: !state?.attributes?.coatingUnit,

        },
        {
            name: "Distance from lead edge",
            label: "machineAttributes.coatingDistance",
            type: "text",
            placeholder: "machineAttributes.coatingDistance",
            required: true,
            parameterKey: "coatingDistance",
            unit: EMeasurementUnits.CM,
            options: [],
            machineInputType: 'input',
            value: state?.attributes?.coatingDistance ? state?.attributes?.coatingDistance : '',
            isValid: !!state?.attributes?.coatingDistance,
            disabled: !state?.attributes?.coatingUnit,

        },
        {
            name: 'machineAttributes.coatingBlanket',
            parameterKey: 'coatingBlanket',
            machineInputType: 'multiInput',
            value: state?.attributes?.coatingBlanket,
            isValid: !!state?.attributes?.coatingBlanket?.length &&
                !!state?.attributes?.coatingBlanket?.width ,
            disabled: !state?.attributes?.coatingUnit,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.coatingBlanket?.length ? state.attributes?.coatingBlanket?.length : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.coatingBlanket?.width ? state.attributes?.coatingBlanket?.width : '',
                    unit: EMeasurementUnits.CM

                },
            ]
        },
        {
            name: 'machineAttributes.coatingPlate',
            parameterKey: 'coatingPlate',
            machineInputType: 'multiInput',
            value: state?.attributes?.coatingPlate,
            isValid: !!state?.attributes?.coatingPlate?.length &&
                !!state?.attributes?.coatingPlate?.width ,
            disabled: !state?.attributes?.coatingUnit,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.coatingPlate?.length ? state.attributes?.coatingPlate?.length : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.coatingPlate?.width ? state.attributes?.coatingPlate?.width : '',
                    unit: EMeasurementUnits.CM

                },
            ]
        },
        {
            name: 'machineAttributes.maxCoatingArea',
            parameterKey: 'maxCoatingArea',
            machineInputType: 'multiInput',
            value: state?.attributes?.maxCoatingArea,
            isValid: !!state?.attributes?.maxCoatingArea?.length &&
                !!state?.attributes?.maxCoatingArea?.width ,
            disabled: !state?.attributes?.coatingUnit,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.maxCoatingArea?.length ? state.attributes?.maxCoatingArea?.length : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.maxCoatingArea?.width ? state.attributes?.maxCoatingArea?.width : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },

    ]
};


export {ofssetPrinting}