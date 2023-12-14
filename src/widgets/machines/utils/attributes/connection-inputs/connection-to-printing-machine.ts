import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const connectionToPrintingMachine = (state: Record<string, any>) => {
    const parameterKey = 'connectToPrinting';
    const label = 'connectToPrinting'
    return [
        {
            machineInputType: 'multiInput',
            name: `machineAttributes.${label}`,
            parameterKey: parameterKey,
            isValid: true,
            value: state[parameterKey],
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.isConnect",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "isConnect",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['isConnect'] ? !!state.attributes[parameterKey]['isConnect'] : false,
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                },
                {
                    name: "machineList",
                    label: "machineAttributes.machineList",
                    type: "select",
                    placeholder: "machineAttributes.machineList",
                    required: true,
                    parameterKey: "machine",
                    value: state.attributes[parameterKey]?.machine ? state.attributes[parameterKey]?.machine : '',
                    optionsUrl: state.attributes[parameterKey]?.isConnect ? '/v1/machines-list/category/' + ECategoryId.DIGITAL_PRINTING : '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes[parameterKey]?.isConnect

                },
                {
                    name: "delayBetweenUnits",
                    label: "machineAttributes.delayBetweenUnits",
                    type: "text",
                    placeholder: "machineAttributes.delayBetweenUnits",
                    required: true,
                    parameterKey: "delayBetweenUnits",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['delayBetweenUnits'] ? !!state.attributes[parameterKey]['delayBetweenUnits'] : '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes[parameterKey]?.isConnect,
                    unit: EMeasurementUnits.MINUTE
                },
                {
                    name: "",
                    label: "machineAttributes.isAvailableCollectorStacker",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "isAvailableCollectorStacker",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['isAvailableCollectorStacker'] ? !!state.attributes[parameterKey]['isAvailableCollectorStacker'] : false,
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes[parameterKey]?.isConnect
                },
                {
                    name: "",
                    label: "machineAttributes.paperTrackLength",
                    type: "text",
                    placeholder: "machineAttributes.paperTrackLength",
                    required: true,
                    parameterKey: "paperTrackLength",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['paperTrackLength'] ? !!state.attributes[parameterKey]['paperTrackLength'] : '',
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                    disabled: !state.attributes[parameterKey]?.isConnect || state.attributes[parameterKey]?.isAvailableCollectorStacker,
                    unit: EMeasurementUnits.CM
                },
            ]
        },
    ];
}

export {connectionToPrintingMachine};