import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "available",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "printOverLaminateIsAvailable",
            options: [],
            value: state.attributes?.printOverLaminateIsAvailable ? state.attributes?.printOverLaminateIsAvailable : ''
        },
        {
            name: "",
            label: "machineAttributes.speedAdjustment",
            type: "text",
            placeholder: "machineAttributes.speedAdjustment",
            required: true,
            parameterKey: "printOverlaySpeedAdjustment",
            options: [],
            value: state?.attributes?.printOverlaySpeedAdjustment,
            disabled: !state?.attributes?.printOverLaminateIsAvailable,
            unit: EMeasurementUnits.PERCENTAGE
        },
        {
            name: "machineAttributes.foilOverLayColor",
            label: "machineAttributes.color",
            type: "text",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "foilOverLayColor",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.foilOverLayColor,
            isValid: true,
            materialType: 'colors',
            disabled: !state.attributes?.printOverLaminateIsAvailable
        },
        {
            name: "machineAttributes.scratchFoilOverlayColor",
            label: "machineAttributes.color",
            type: "text",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "scratchFoilOverlayColor",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.scratchFoilOverlayColor,
            isValid: true,
            materialType: 'colors',
            disabled: !state.attributes?.printOverLaminateIsAvailable
        },
    ];
}

export {digitalPrinting};