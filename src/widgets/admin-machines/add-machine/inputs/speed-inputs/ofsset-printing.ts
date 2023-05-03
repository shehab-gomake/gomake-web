import {ESpeedInputMethods} from "@/widgets/admin-machines/add-machine/inputs/speed-inputs/digital-printing";

const ofssetPrinting = (state: Record<string, any>) => {
    const speedByPaperThickness =  {
            name: 'machineAttributes.speedByPaperThickness',
            parameterKey: 'speedByPaperThickness',
            value: state.attributes?.speedByPaperThickness || [],
            isValid: state.attributes?.speedByPaperThickness?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.mediaWeightMainSpeed",
                    type: "text",
                    placeholder: "machineAttributes.mediaWeightMainSpeed",
                    required: true,
                    parameterKey: "mediaWeightMainSpeed",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.maxTargetMediaWeight",
                    type: "text",
                    placeholder: "machineAttributes.maxTargetMediaWeight",
                    required: true,
                    parameterKey: "maxTargetMediaWeight",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.minTargetMediaWeight",
                    type: "text",
                    placeholder: "machineAttributes.minTargetMediaWeight",
                    required: true,
                    parameterKey: "minTargetMediaWeight",
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: []
                },
            ]
        };
     const inputs =  (method: ESpeedInputMethods): any[] =>  {
        switch (method) {
            case ESpeedInputMethods.COLOR_SPEED:
                return [
                    {
                        name: 'machineAttributes.speedByColor',
                        parameterKey: 'speedByColor',
                        value: state.attributes?.speedByColor || [],
                        machineInputType: 'multiArrayInput',
                        isValid: state.attributes?.speedByColor?.length > 0,
                        inputs: [
                            {
                                name: "color",
                                label: "machineAttributes.color",
                                type: "text",
                                placeholder: "machineAttributes.color",
                                required: true,
                                parameterKey: "color",
                                options: []
                            },
                            {
                                name: "speed",
                                label: "machineAttributes.speed",
                                type: "text",
                                placeholder: "machineAttributes.speed",
                                required: true,
                                parameterKey: "speed",
                                options: []
                            },
                        ]
                    },
                    speedByPaperThickness
                ];
            case ESpeedInputMethods.COLOR_SIZE_SPEED:
                return [

                    {
                        name: 'machineAttributes.speedByPaperSizeByColor',
                        parameterKey: 'machineAttributes.speedByPaperSizeByColor',
                        value: state.attributes?.speedByColor || [],
                        machineInputType: 'multiArrayInput',
                        isValid: state.attributes?.speedByColor?.length > 0,
                        inputs: [
                            {
                                name: "color",
                                label: "machineAttributes.color",
                                type: "text",
                                placeholder: "machineAttributes.color",
                                required: true,
                                parameterKey: "color",
                                options: []
                            },
                            {
                                name: "mediaLength",
                                label: "machineAttributes.mediaLength",
                                type: "text",
                                placeholder: "machineAttributes.mediaLength",
                                required: true,
                                parameterKey: "mediaLength",
                                options: []
                            },
                            {
                                name: "mediaWidth",
                                label: "machineAttributes.mediaWidth",
                                type: "text",
                                placeholder: "machineAttributes.mediaWidth",
                                required: true,
                                parameterKey: "mediaWidth",
                                options: []
                            },
                            {
                                name: "speed",
                                label: "machineAttributes.speed",
                                type: "text",
                                placeholder: "machineAttributes.speed",
                                required: true,
                                parameterKey: "speed",
                                options: []
                            },
                        ]
                    },
                    speedByPaperThickness
                ];
            default:
                return []
        }
    }

    return inputs
}

export {ofssetPrinting};


