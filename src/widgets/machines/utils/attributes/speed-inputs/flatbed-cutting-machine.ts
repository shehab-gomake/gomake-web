import {cuttingLevel} from "@/widgets/machines/utils/const/cutting-level";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import { useTranslation } from "react-i18next";

const flatbedCuttingMachine = (state: Record<string, any>) => {
    const { t } = useTranslation(); 
    const translatedCuttingLevel = cuttingLevel.map(({ value, text }) => ({
        value,
        text: t(text)
    }));

    return [
        ...setupTimeInput(state), 
        {
            name: "speed",
            label: "machineAttributes.speed",
            type: "text",
            placeholder: "machineAttributes.speed",
            required: true,
            parameterKey: "speed",
            options: [],
            unit: EMeasurementUnits.MM_P_SECOND,
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
        },
        {
            name: "feederSpeed",
            label: "machineAttributes.feederSpeed",
            type: "text",
            placeholder: "machineAttributes.feederSpeed",
            required: true,
            parameterKey: "feederSpeed",
            options: [],
            unit: EMeasurementUnits.SPH,
            value: state.attributes?.feederSpeed ? state.attributes?.feederSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.feederSpeed,
        },
        {
            name: 'machineAttributes.speedByComplexity',
            parameterKey: 'speedByShapeComplexity',
            value: state.attributes?.speedByShapeComplexity || [],
            isValid: state.attributes?.speedByShapeComplexity?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "shape",
                    label: "machineAttributes.shape",
                    type: "select",
                    placeholder: "machineAttributes.shape",
                    required: true,
                    parameterKey: "shape",
                    options: [],
                    optionsUrl: '/v1/print-house-config/parameters/shape-complexity'
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "number",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },

            ]
        },

    ]
}

export {flatbedCuttingMachine};