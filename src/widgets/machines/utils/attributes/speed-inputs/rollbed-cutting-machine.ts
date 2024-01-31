import {cuttingLevel} from "@/widgets/machines/utils/const/cutting-level";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import { useTranslation } from "react-i18next";

const rollbedCuttingMachine = (state: Record<string, any>) => {
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
            value: state.attributes?.speed ? state.attributes?.speed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.speed,
            unit: EMeasurementUnits.MM_P_SECOND
        },
        {
            name: 'machineAttributes.speedByComplexity',
            parameterKey: 'speedByCuttingLevel',
            value: state.attributes?.speedByCuttingLevel || [],
            isValid: state.attributes?.speedByCuttingLevel?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "cuttingLevel",
                    label: "machineAttributes.cuttingLevel",
                    type: "select",
                    placeholder: "machineAttributes.cuttingLevel",
                    required: true,
                    parameterKey: "cuttingLevel",
                    options: translatedCuttingLevel,
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
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

export {rollbedCuttingMachine};