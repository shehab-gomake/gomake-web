const digitalPrinting = (state: Record<string, any>) => {
     const inputs =  (method: ESpeedInputMethods): any[] =>  {
        switch (method) {
            case ESpeedInputMethods.COLOR_SPEED:
                return [
                    {
                        name: 'speed by colors number',
                        parameterKey: 'speedByColor',
                        value: state.attributes?.speedByColor || [],
                        machineInputType: 'multiArrayInput',
                        isValid: state.attributes?.speedByColor?.length > 0,
                        inputs: [
                            {
                                name: "color",
                                label: "adminAddMachine.color",
                                type: "text",
                                placeholder: "Color",
                                required: true,
                                parameterKey: "color",
                                options: []
                            },
                            {
                                name: "speed",
                                label: "adminAddMachine.speed",
                                type: "text",
                                placeholder: "Speed",
                                required: true,
                                parameterKey: "speed",
                                options: []
                            },
                        ]
                    },

                    {
                        name: 'The speed coefficient according to Media Weight ',
                        parameterKey: 'speedByMediaWeight',
                        value: state.attributes?.speedByMediaWeight || [],
                        isValid: state.attributes?.speedByMediaWeight?.length > 0,
                        machineInputType: 'multiArrayInput',
                        inputs: [
                            {
                                name: "weight",
                                label: "adminAddMachine.weight",
                                type: "text",
                                placeholder: "Weight",
                                required: true,
                                parameterKey: "weight",
                                options: []
                            },
                            {
                                name: "speedPercentage",
                                label: "adminAddMachine.speedPercentage",
                                type: "text",
                                placeholder: "Speed percentage",
                                required: true,
                                parameterKey: "speedPercentage",
                                options: []
                            },

                        ]
                    },
                ];
            case ESpeedInputMethods.COLOR_SIZE_SPEED:
                return [

                    {
                        name: 'Speed by paper size by colors number',
                        parameterKey: 'speedByPaperSizeByColor',
                        value: state.attributes?.speedByColor || [],
                        machineInputType: 'multiArrayInput',
                        isValid: state.attributes?.speedByColor?.length > 0,
                        inputs: [
                            {
                                name: "color",
                                label: "adminAddMachine.color",
                                type: "text",
                                placeholder: "Color",
                                required: true,
                                parameterKey: "color",
                                options: []
                            },
                            {
                                name: "mediaLength",
                                label: "adminAddMachine.mediaLength",
                                type: "text",
                                placeholder: "Length",
                                required: true,
                                parameterKey: "mediaLength",
                                options: []
                            },
                            {
                                name: "mediaWidth",
                                label: "adminAddMachine.mediaWidth",
                                type: "text",
                                placeholder: "Width",
                                required: true,
                                parameterKey: "mediaWidth",
                                options: []
                            },
                            {
                                name: "speed",
                                label: "adminAddMachine.speed",
                                type: "text",
                                placeholder: "Speed",
                                required: true,
                                parameterKey: "speed",
                                options: []
                            },
                        ]
                    },

                    {
                        name: 'The speed coefficient according to Media Weight ',
                        parameterKey: 'speedByMediaWeight',
                        value: state.attributes?.speedByMediaWeight || [],
                        isValid: state.attributes?.speedByMediaWeight?.length > 0,
                        machineInputType: 'multiArrayInput',
                        inputs: [
                            {
                                name: "weight",
                                label: "adminAddMachine.weight",
                                type: "text",
                                placeholder: "Weight",
                                required: true,
                                parameterKey: "weight",
                                options: []
                            },
                            {
                                name: "speedPercentage",
                                label: "adminAddMachine.speedPercentage",
                                type: "text",
                                placeholder: "Speed percentage",
                                required: true,
                                parameterKey: "speedPercentage",
                                options: []
                            },

                        ]
                    },
                ];
            default:
                return []
        }
    }

    return inputs
}

export {digitalPrinting};



export enum ESpeedInputMethods {
    COLOR_SPEED = 1,
    COLOR_SIZE_SPEED = 2
}
