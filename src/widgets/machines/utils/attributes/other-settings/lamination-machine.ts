import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {ECategoryId} from "@/widgets/machines/enums/category-id";
import {useTranslation} from "react-i18next";

const laminationMachine = (state: Record<string, any>) => {
    const {t} = useTranslation();
    return [
        {
            name: "",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "isAvailableFoilUnit",
            options: [],
            value: state?.attributes?.isAvailableFoilUnit
        },
        {
            name: "",
            label: "machineAttributes.setupTime",
            type: "text",
            placeholder: "machineAttributes.setupTime",
            required: true,
            parameterKey: "foilSetupTime",
            options: [],
            value: state?.attributes?.foilSetupTime,
            disabled: !state?.attributes?.isAvailableFoilUnit,
            unit: EMeasurementUnits.MINUTE
        },
        {
            name: "",
            label: "machineAttributes.speedAdjustment",
            type: "text",
            placeholder: "machineAttributes.speedAdjustment",
            required: true,
            parameterKey: "foilSpeedAdjustment",
            options: [],
            value: state?.attributes?.foilSpeedAdjustment,
            disabled: !state?.attributes?.isAvailableFoilUnit,
            unit: EMeasurementUnits.PERCENTAGE
        },
        {
            name: "",
            label: "machineAttributes.preFoilMachinePrint",
            type: "select",
            placeholder: "machineAttributes.preFoilMachinePrint",
            required: true,
            parameterKey: "preFoilMachinePrint",
            options: [
                {value: ECategoryId.DIGITAL_PRINTING, text: t('machinesCategories.digitalPrinting')},
                {value: ECategoryId.DIGITAL_ENHANCEMENT_MACHINE, text: t('machinesCategories.digitalEnhancement')},
            ],
            values: state?.attributes?.preFoilMachinePrint,
            disabled: !state?.attributes?.isAvailableFoilUnit,
            multiple: true
        },
    ]
}

export {laminationMachine};