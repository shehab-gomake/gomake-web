import {laminationTypes} from "@/widgets/machines/utils/const/lamination-types";

const rollLaminationMachine = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'laminationSettings',
            value: state.attributes?.laminationSettings || [],
            isValid: state.attributes?.laminationSettings?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "type",
                    label: "machineAttributes.type",
                    type: "select",
                    placeholder: "machineAttributes.type",
                    required: true,
                    parameterKey: "type",
                    options: laminationTypes
                },
                {
                    name: "pricePerCM",
                    label: "machineAttributes.pricePerCM",
                    type: "text",
                    placeholder: "machineAttributes.pricePerCM",
                    required: true,
                    parameterKey: "pricePerCM",
                    options: []
                },
                {
                    name: "glueCostCM",
                    label: "machineAttributes.glueCostCM",
                    type: "text",
                    placeholder: "machineAttributes.glueCostCM",
                    required: true,
                    parameterKey: "glueCostCM",
                    options: [],
                    machineInputType: 'input',
                },
            ]
        }
    ];
}

export {rollLaminationMachine};