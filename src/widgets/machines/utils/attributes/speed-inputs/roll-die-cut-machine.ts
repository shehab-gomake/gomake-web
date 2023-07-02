import {shapes} from "@/widgets/machines/utils/const/shapes";

const rollDieCutMachine = (state: Record<string, any>) => {
    return [
        {
            name: "setupTime",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "setupTime",
            options: [],
            value: state.attributes?.setupTime ? state.attributes?.setupTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.setupTime,
        },
        {
            name: "straightKnife",
            label: "machineAttributes.straightKnife",
            type: "switch",
            placeholder: "machineAttributes.straightKnife",
            required: true,
            parameterKey: "straightKnife",
            value: state?.attributes?.straightKnife,
            options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "straightKnifeSetupTime",
            label: "machineAttributes.straightKnifeSetupTime",
            type: "text",
            placeholder: "machineAttributes.straightKnifeSetupTime",
            required: state?.attributes?.straightKnifeSetupTime,
            parameterKey: "straightKnifeSetupTime",
            options: [],
            disabled: !state?.attributes?.straightKnife,
            value: state?.attributes?.straightKnife && state?.attributes?.straightKnifeSetupTime ? state?.attributes?.straightKnifeSetupTime : '',
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            parameterKey: "maxSpeed",
            options: [],
            value: state.attributes?.maxSpeed ? state.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
        },
        {
            name: 'machineAttributes.stopTimePerRoll',
            parameterKey: 'stopTimePerRoll',
            machineInputType: 'multiInput',
            value: state.attributes?.stopTimePerRoll ? state.attributes?.stopTimePerRoll : {},
            isValid: !!state?.attributes?.stopTimePerRoll?.firstColumn &&
                !!state?.attributes?.stopTimePerRoll?.forEachAdditionalColumn &&
                !!state?.attributes?.stopTimePerRoll?.forEachAdditionalColumnStraightKnife,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.firstColumn",
                    type: "text",
                    placeholder: "machineAttributes.firstColumn",
                    required: true,
                    parameterKey: "firstColumn",
                    options: [],
                    value: state.attributes?.stopTimePerRoll?.firstColumn ? state.attributes?.stopTimePerRoll?.firstColumn : ''

                },
                {
                    name: "",
                    label: "machineAttributes.forEachAdditionalColumn",
                    type: "text",
                    placeholder: "machineAttributes.forEachAdditionalColumn",
                    required: true,
                    parameterKey: "forEachAdditionalColumn",
                    options: [],
                    value: state.attributes?.stopTimePerRoll?.forEachAdditionalColumn ? state.attributes?.stopTimePerRoll?.forEachAdditionalColumn : ''

                },
                {
                    name: "",
                    label: "machineAttributes.forEachAdditionalColumnStraightKnife",
                    type: "text",
                    placeholder: "machineAttributes.forEachAdditionalColumnStraightKnife",
                    required: true,
                    parameterKey: "forEachAdditionalColumnStraightKnife",
                    options: [],
                    value: state.attributes?.stopTimePerRoll?.forEachAdditionalColumnStraightKnife ? state.attributes?.stopTimePerRoll?.forEachAdditionalColumnStraightKnife : ''

                },
            ]
        },
        {
            name: 'machineAttributes.speedByLength',
            parameterKey: 'speedByLength',
            value: state.attributes?.speedByLength || [],
            isValid: state.attributes?.speedByLength?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "upToJumpLength",
                    label: "machineAttributes.upToJumpLength",
                    type: "text",
                    placeholder: "machineAttributes.upToJumpLength",
                    required: true,
                    parameterKey: "upToJumpLength",
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
        {
            name: 'machineAttributes.speedByMediaType',
            parameterKey: 'speedByMediaType',
            value: state.attributes?.speedByMediaType || [],
            isValid: state.attributes?.speedByMediaType?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "mediaType",
                    label: "machineAttributes.mediaType",
                    type: "text",
                    placeholder: "machineAttributes.mediaType",
                    required: true,
                    parameterKey: "mediaType",
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
        {
            name: 'machineAttributes.speedByShape',
            parameterKey: 'speedByShape',
            value: state.attributes?.speedByShape || [],
            isValid: state.attributes?.speedByShape?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "shape",
                    label: "machineAttributes.shape",
                    type: "select",
                    placeholder: "machineAttributes.shape",
                    required: true,
                    parameterKey: "shape",
                    options: shapes
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

export {rollDieCutMachine};