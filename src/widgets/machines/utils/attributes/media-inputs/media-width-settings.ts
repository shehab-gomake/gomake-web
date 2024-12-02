import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const mediaWidthSettings = (state: Record<string, any>,unit = EMeasurementUnits.CM) => {
    return [
        {
            name: 'machineAttributes.mediaWidth',
            parameterKey: 'mediaWidth',
            machineInputType: 'multiInput',
            value: state?.attributes?.mediaWidth,
            isValid: true ,
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
                    value: state.attributes?.mediaWidth?.min ? state.attributes?.mediaWidth?.min : ''

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
                    value: state.attributes?.mediaWidth?.max ? state.attributes?.mediaWidth?.max : ''
                },
            ]
        },
    ]
}


export {mediaWidthSettings};