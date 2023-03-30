const speedInputs = (state: Record<string, any>) => {
    return [
        {
            name: 'speed by colors number',
            key: 'speedByColor',
            value: state['speedByColor'] || [],
            inputs: [
                {
                    name: "color",
                    label: "adminAddMachine.color",
                    type: "text",
                    placeholder: "Color",
                    required: true,
                    key: "color",
                    options: []
                },
                {
                    name: "speed",
                    label: "adminAddMachine.speed",
                    type: "text",
                    placeholder: "Speed",
                    required: true,
                    key: "speed",
                    options: []
                },
            ]
        },
        {
            name: 'Speed by paper size by colors number',
            key: 'speedByPaperSizeByColor',
            value: state['speedByPaperSizeByColor'] || [],
            inputs: [
                {
                    name: "color",
                    label: "adminAddMachine.color",
                    type: "text",
                    placeholder: "Color",
                    required: true,
                    key: "color",
                    options: []
                },
                {
                    name: "mediaLength",
                    label: "adminAddMachine.mediaLength",
                    type: "text",
                    placeholder: "Length",
                    required: true,
                    key: "mediaLength",
                    options: []
                },
                {
                    name: "mediaWidth",
                    label: "adminAddMachine.mediaWidth",
                    type: "text",
                    placeholder: "Width",
                    required: true,
                    key: "mediaWidth",
                    options: []
                },
                {
                    name: "speed",
                    label: "adminAddMachine.speed",
                    type: "text",
                    placeholder: "Speed",
                    required: true,
                    key: "speed",
                    options: []
                },
            ]
        },

        {
            name: 'The speed coefficient according to Media Weight ',
            key: 'speedByMediaWeight',
            value: state['speedByMediaWeight'] || [],
            inputs: [
                {
                    name: "weight",
                    label: "adminAddMachine.weight",
                    type: "text",
                    placeholder: "Weight",
                    required: true,
                    key: "weight",
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "adminAddMachine.speedPercentage",
                    type: "text",
                    placeholder: "Speed percentage",
                    required: true,
                    key: "speedPercentage",
                    options: []
                },

            ]
        },
    ]
}

export {speedInputs};