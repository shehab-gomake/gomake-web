const flexoPrinting = (state: Record<string, any>) => {
    const speedByMediaWeight = {
        name: 'machineAttributes.speedByMediaWeight',
        parameterKey: 'speedByMediaWeight',
        value: state.attributes?.speedByMediaWeight || [],
        isValid: state.attributes?.speedByMediaWeight?.length > 0,
        machineInputType: 'multiArrayInput',
        inputs: [
            {
                name: "weight",
                label: "machineAttributes.weight",
                type: "text",
                placeholder: "machineAttributes.weight",
                required: true,
                parameterKey: "weight",
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
    }
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
                    speedByMediaWeight
                ];
            case ESpeedInputMethods.COLOR_SIZE_SPEED:
                return [

                    {
                        name: 'speedByPaperSizeByColor',
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
                    speedByMediaWeight
                ];
            default:
                return []
        }
    }

    return inputs
}

export {flexoPrinting};



export enum ESpeedInputMethods {
    COLOR_SPEED = 1,
    COLOR_SIZE_SPEED = 2
}


