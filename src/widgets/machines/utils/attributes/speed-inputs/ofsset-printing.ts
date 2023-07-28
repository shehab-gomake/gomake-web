import {digitalPrinting} from "@/widgets/machines/utils/attributes/speed-inputs/digital-printing";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        ...digitalPrinting(state),
        {
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
    },
        ]
}


export {ofssetPrinting};


