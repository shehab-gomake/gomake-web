import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const mediaThicknessSettings = (state: Record<string, any>,unit = EMeasurementUnits.MM) => {
    return [
        {
            name: 'machineAttributes.mediaThickness',
            parameterKey: 'mediaThickness',
            machineInputType: 'multiInput',
            value: state?.attributes?.mediaThickness,
            isValid: !!state?.attributes?.mediaThickness?.min &&
                !!state?.attributes?.mediaThickness?.max  ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    unit: unit,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.mediaThickness?.min ? state.attributes?.mediaThickness?.min : ''

                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    unit: unit,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.mediaThickness?.max ? state.attributes?.mediaThickness?.max : ''
                },
            ]
        },
    ]
}


export {mediaThicknessSettings};