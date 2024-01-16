import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const PVCBendingMachine = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.pvc',
            parameterKey: 'pvc',
            machineInputType: 'multiInput',
            value: state?.attributes?.pvc,
            isValid: !!state?.attributes?.pvc?.maxWidth &&
                !!state?.attributes?.pvc?.maxLength &&
                !!state?.attributes?.pvc?.maxThickness ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.maxWidth",
                    type: "text",
                    placeholder: "machineAttributes.maxWidth",
                    required: true,
                    parameterKey: "maxWidth",
                    options: [],
                    value: state.attributes?.pvc?.maxWidth ? state.attributes?.pvc?.maxWidth : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.maxLength",
                    type: "text",
                    placeholder: "machineAttributes.maxLength",
                    required: true,
                    parameterKey: "maxLength",
                    options: [],
                    value: state.attributes?.pvc?.maxLength ? state.attributes?.pvc?.maxLength : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
                    options: [],
                    value: state.attributes?.pvc?.maxThickness ? state.attributes?.pvc?.maxThickness : '',
                    unit: EMeasurementUnits.MM
                },
            ]
        },
    ]
}


export {PVCBendingMachine};