import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

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
        ...maxSpeedInput(state, EMeasurementUnits.SETS_HOUR),
        {
            name: 'machineAttributes.feederSettings',
            parameterKey: 'feederSettings',
            machineInputType: 'multiInput',
            value: state.attributes?.autoActionFeederType ? state.attributes?.autoActionFeederType : {},
            isValid: !!state?.attributes?.autoActionFeederType?.feederHeight &&
                !!state?.attributes?.autoActionFeederType?.insertSpeed,

            inputs: [
                {
                    name: "loadingWhileRunning",
                    label: "machineAttributes.loadingWhileRunning",
                    type: "switch",
                    placeholder: "machineAttributes.loadingWhileRunning",
                    required: true,
                    parameterKey: "loadingWhileRunning",
                    value: state.attributes?.feederSettings?.loadingWhileRunning,
                    options: [],
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
                    value: state.attributes?.feederSettings?.feederHeight ? state.attributes?.feederSettings?.feederHeight : '',
                    disabled: !!state.attributes?.feederSettings?.loadingWhileRunning,
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.insertSpeed",
                    type: "text",
                    placeholder: "machineAttributes.insertSpeed",
                    required: true,
                    parameterKey: "insertSpeed",
                    options: [],
                    value: state.attributes?.feederSettings?.insertSpeed ? state.attributes?.feederSettings?.insertSpeed : '',
                    disabled: !!state.attributes?.feederSettings?.loadingWhileRunning,
                    unit: EMeasurementUnits.MINUTE
                },
            ]
        },
        {
            name: 'machineAttributes.stackerSettings',
            parameterKey: 'stackerSettings',
            machineInputType: 'multiInput',
            value: state.attributes?.stackerSettings ? state.attributes?.stackerSettings : {},
            isValid: !!state?.attributes?.stackerSettings?.feederHeight &&
                !!state?.attributes?.stackerSettings?.insertSpeed,

            inputs: [
                {
                    name: "unloadingOnRun",
                    label: "machineAttributes.unloadingOnRun",
                    type: "switch",
                    placeholder: "machineAttributes.unloadingOnRun",
                    required: true,
                    parameterKey: "unloadingOnRun",
                    value: state.attributes?.stackerSettings?.unloadingOnRun,
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "",
                    label: "machineAttributes.stackerHeight",
                    type: "text",
                    placeholder: "machineAttributes.stackerHeight",
                    required: true,
                    parameterKey: "stackerHeight",
                    options: [],
                    value: state.attributes?.stackerSettings?.stackerHeight ? state.attributes?.stackerSettings?.stackerHeight : '',
                    unit: EMeasurementUnits.CM,
                    disabled: !!state.attributes?.stackerSettings?.unloadingOnRun
                },
                {
                    name: "",
                    label: "machineAttributes.unloadSpeed",
                    type: "text",
                    placeholder: "machineAttributes.unloadSpeed",
                    required: true,
                    parameterKey: "unloadSpeed",
                    options: [],
                    value: state.attributes?.stackerSettings?.unloadSpeed ? state.attributes?.stackerSettings?.unloadSpeed : '',
                    unit: EMeasurementUnits.MINUTE,
                    disabled: !!state.attributes?.stackerSettings?.unloadingOnRun

                },
            ]
        },
    ]
}

export {spiralPerforationMachine};