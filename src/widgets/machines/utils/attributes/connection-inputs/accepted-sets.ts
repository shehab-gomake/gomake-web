import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const acceptedSets = (state: Record<string, any>) => {
    const parameterKey = 'acceptedSets';
    const label = 'acceptedSets'
    return [
        {
            machineInputType: 'multiInput',
            name: `machineAttributes.${label}`,
            parameterKey: parameterKey,
            isValid: true,
            value: state.attributes[parameterKey],
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.notAcceptGatheredSets",
                    type: "switch",
                    placeholder: "",
                    required: true,
                    parameterKey: "notAcceptGatheredSets",
                    value: state.attributes[parameterKey] && state.attributes[parameterKey]['notAcceptGatheredSets'] ? !!state.attributes[parameterKey]['notAcceptGatheredSets'] : false,
                    options: [],
                    machineInputType: 'input',
                    isValid: true,
                },
            ]
        },
    ];
}

export {acceptedSets};