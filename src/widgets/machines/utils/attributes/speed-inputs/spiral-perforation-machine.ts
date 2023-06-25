import {feedOptions} from "@/widgets/machines/utils/const/feed-options";

const spiralPerforationMachine = (state: Record<string, any>) => {
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
            name: "actionType",
            label: "machineAttributes.actionType",
            type: "select",
            placeholder: "machineAttributes.actionType",
            required: true,
            parameterKey: "actionType",
            value: state.attributes?.actionType,
            options: feedOptions,
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: 'machineAttributes.autoActionFeederType',
            parameterKey: 'autoActionFeederType',
            machineInputType: 'multiInput',
            value: state.attributes?.autoActionFeederType ? state.attributes?.autoActionFeederType : {},
            isValid: !!state?.attributes?.autoActionFeederType?.feederHeight &&
                !!state?.attributes?.autoActionFeederType?.insertSpeed,

            inputs: [
                {
                    name: "loadingWhileRunning",
                    label: "machineAttributes.loadingWhileRunning",
                    type: "select",
                    placeholder: "machineAttributes.loadingWhileRunning",
                    required: true,
                    parameterKey: "loadingWhileRunning",
                    value: state.attributes?.autoActionFeederType?.loadingWhileRunning,
                    options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "",
                    label: "machineAttributes.feederHeight",
                    type: "text",
                    placeholder: "machineAttributes.feederHeight",
                    required: true,
                    parameterKey: "feederHeight",
                    options: [],
                    value: state.attributes?.autoActionFeederType?.feederHeight ? state.attributes?.autoActionFeederType?.feederHeight : ''

                },
                {
                    name: "",
                    label: "machineAttributes.insertSpeed",
                    type: "text",
                    placeholder: "machineAttributes.insertSpeed",
                    required: true,
                    parameterKey: "insertSpeed",
                    options: [],
                    value: state.attributes?.autoActionFeederType?.insertSpeed ? state.attributes?.autoActionFeederType?.insertSpeed : ''

                },
            ]
        },
        {
            name: 'machineAttributes.autoActionStackerType',
            parameterKey: 'autoActionStackerType',
            machineInputType: 'multiInput',
            value: state.attributes?.autoActionStackerType ? state.attributes?.autoActionStackerType : {},
            isValid: !!state?.attributes?.autoActionStackerType?.feederHeight &&
                !!state?.attributes?.autoActionStackerType?.insertSpeed,

            inputs: [
                {
                    name: "loadingWhileRunning",
                    label: "machineAttributes.loadingWhileRunning",
                    type: "select",
                    placeholder: "machineAttributes.loadingWhileRunning",
                    required: true,
                    parameterKey: "loadingWhileRunning",
                    value: state.attributes?.autoActionStackerType?.loadingWhileRunning,
                    options: [{value: false, text: 'No'}, {value: true, text: 'Yes'}],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "",
                    label: "machineAttributes.feederHeight",
                    type: "text",
                    placeholder: "machineAttributes.feederHeight",
                    required: true,
                    parameterKey: "feederHeight",
                    options: [],
                    value: state.attributes?.autoActionStackerType?.feederHeight ? state.attributes?.autoActionStackerType?.feederHeight : ''

                },
                {
                    name: "",
                    label: "machineAttributes.insertSpeed",
                    type: "text",
                    placeholder: "machineAttributes.insertSpeed",
                    required: true,
                    parameterKey: "insertSpeed",
                    options: [],
                    value: state.attributes?.autoActionStackerType?.insertSpeed ? state.attributes?.autoActionStackerType?.insertSpeed : ''

                },
            ]
        },
        {
            name: 'machineAttributes.insertSpeed',
            parameterKey: 'insertSpeed',
            value: state.attributes?.insertSpeed || [],
            isValid: state.attributes?.insertSpeed?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "maxThickness",
                    label: "machineAttributes.maxThickness",
                    type: "text",
                    placeholder: "machineAttributes.maxThickness",
                    required: true,
                    parameterKey: "maxThickness",
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
        }
    ]
}

export {spiralPerforationMachine};