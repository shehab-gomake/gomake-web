const mediaSettingsInputs = (state: Record<string, any>) => {
    return [
        {
            name: "setupTimeMin",
            label: "adminAddMachine.setupTimeMin",
            type: "text",
            placeholder: "setupTimeMin",
            required: true,
            key: "setupTimeMin",
            options: []
        },
        {
            name: "minMediaDimensions",
            label: "adminAddMachine.minMediaDimensions",
            type: "text",
            placeholder: "Min media dimensions",
            required: true,
            key: "minMediaDimensions",
            options: []
        },
        {
            name: "maxMediaDimensions",
            label: "adminAddMachine.maxMediaDimensions",
            type: "text",
            placeholder: "Max media dimensions",
            required: true,
            key: "maxMediaDimensions",
            options: []
        },


        {
            name: "minMarginWithoutPrinting",
            label: "adminAddMachine.minMarginWithoutPrinting",
            type: "text",
            placeholder: "Min margin without printing",
            required: true,
            key: "minMarginWithoutPrinting",
            options: []
        },
        {
            name: "mediaWeight",
            label: "adminAddMachine.mediaWeight",
            type: "text",
            placeholder: "Min",
            required: true,
            key: "mediaWeightMin",
            options: []
        },
        {
            name: "mediaWeight",
            label: "adminAddMachine.mediaWeight",
            type: "text",
            placeholder: "Max",
            required: true,
            key: "mediaWeightMax",
            options: []
        },
        {
            name: "mediaThickness",
            label: "adminAddMachine.mediaThickness",
            type: "text",
            placeholder: "Min",
            required: true,
            key: "mediaThicknessMin",
            options: []
        },
        {
            name: "mediaThickness",
            label: "adminAddMachine.mediaThickness",
            type: "text",
            placeholder: "Max",
            required: true,
            key: "mediaThicknessMax",
            options: []
        },
        {
            name: "coatingUnit",
            label: "adminAddMachine.coatingUnit",
            type: "select",
            placeholder: "Media coating unit",
            required: true,
            key: "coatingUnit",
            value: state["coatingUnit"],
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}]
        },
        {
            name: "coatingUnitCost",
            label: "adminAddMachine.coatingUnitCost",
            type: "text",
            placeholder: "Cost for meter^2",
            required: true,
            key: "coatingUnitCost",
            options: [],
            disabled: !state["coatingUnit"]
        },
    ]
}

export {mediaSettingsInputs};