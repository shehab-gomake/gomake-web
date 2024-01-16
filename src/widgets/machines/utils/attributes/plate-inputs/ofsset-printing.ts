import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.plateCylinder',
            parameterKey: 'plateCylinder',
            machineInputType: 'multiInput',
            value: state?.attributes?.plateCylinder,
            isValid: !!state?.attributes?.plateCylinder?.underCut &&
                !!state?.attributes?.plateCylinder?.distance,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.cylinderUndercut",
                    type: "text",
                    placeholder: "machineAttributes.cylinderUndercut",
                    required: true,
                    parameterKey: "underCut",
                    options: [],
                    value: state.attributes?.plateCylinder?.underCut ? state.attributes?.plateCylinder?.underCut : '',
                    unit: EMeasurementUnits.MM
                },
                {
                    name: "",
                    label: "machineAttributes.plateDistance",
                    type: "text",
                    placeholder: "machineAttributes.plateDistance",
                    required: true,
                    parameterKey: "distance",
                    options: [],
                    value: state.attributes?.plateCylinder?.distance ? state.attributes?.plateCylinder?.distance : '',
                    unit: EMeasurementUnits.CM

                },
            ]
        },
        {
            name: 'machineAttributes.plateSize',
            parameterKey: 'plateSize',
            machineInputType: 'multiInput',
            value: state?.attributes?.plateSize,
            isValid: !!state?.attributes?.plateSize?.length &&
                !!state?.attributes?.plateSize?.width &&
                !!state?.attributes?.plateSize?.thickness,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.plateSize?.length ? state.attributes?.plateSize?.length : '',
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
                    value: state.attributes?.plateSize?.width ? state.attributes?.plateSize?.width : '',
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
                    value: state.attributes?.plateSize?.thickness ? state.attributes?.plateSize?.thickness : '',
                    unit: EMeasurementUnits.MM

                },
            ]
        },
    ]
}


export {ofssetPrinting};