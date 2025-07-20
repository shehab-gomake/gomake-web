import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const cylinderSizeSettings = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.cylinderMaxSize',
            parameterKey: 'cylinderMaxSize',
            machineInputType: 'multiInput',
            value: state?.attributes?.cylinderMaxSize,
            isValid: !!state?.attributes?.cylinderMaxSize?.imageWidth &&
                !!state?.attributes?.cylinderMaxSize?.imageLength  ,
            inputs: [
                {
                    name: "width",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.cylinderMaxSize?.width ? state.attributes?.cylinderMaxSize?.width : '',
                    unit: EMeasurementUnits.MM
                },
                {
                    name: "minTeethNumber",
                    label: "machineAttributes.minTeethNumber",
                    type: "text",
                    placeholder: "machineAttributes.minTeethNumber",
                    required: true,
                    parameterKey: "minTeethNumber",
                    options: [],
                    value: state.attributes?.cylinderMaxSize?.minTeethNumber ? state.attributes?.cylinderMaxSize?.minTeethNumber  : '',
                    unit: EMeasurementUnits.MM
                },
                {
                    name: "maxTeethNumber",
                    label: "machineAttributes.maxTeethNumber",
                    type: "text",
                    placeholder: "machineAttributes.maxTeethNumber",
                    required: true,
                    parameterKey: "maxTeethNumber",
                    options: [],
                    value: state.attributes?.cylinderMaxSize?.maxTeethNumber ? state.attributes?.cylinderMaxSize?.maxTeethNumber  : '',
                    unit: EMeasurementUnits.MM
                },
            ]
        },
    ]
}


export {cylinderSizeSettings};