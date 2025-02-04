import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const mediaImageSizeSettings = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.imageSize',
            parameterKey: 'imageSize',
            machineInputType: 'multiInput',
            value: state?.attributes?.imageSize,
            isValid: !!state?.attributes?.imageSize?.imageWidth &&
                !!state?.attributes?.imageSize?.imageLength  ,
            inputs: [
                {
                    name: "imageWidth",
                    label: "machineAttributes.imageWidth",
                    type: "text",
                    placeholder: "machineAttributes.imageWidth",
                    required: true,
                    parameterKey: "imageWidth",
                    options: [],
                    value: state.attributes?.imageSize?.imageWidth ? state.attributes?.imageSize?.imageWidth : '',
                    unit: EMeasurementUnits.MM
                },
                {
                    name: "imageLength",
                    label: "machineAttributes.imageLength",
                    type: "text",
                    placeholder: "machineAttributes.imageLength",
                    required: true,
                    parameterKey: "imageLength",
                    options: [],
                    value: state.attributes?.imageSize?.imageLength ? state.attributes?.imageSize?.imageLength  : '',
                    unit: EMeasurementUnits.MM
                },
            ]
        },
    ]
}


export {mediaImageSizeSettings};