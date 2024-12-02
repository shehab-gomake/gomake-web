import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const widePrinting = (state: Record<string, any>) => {
    return [
        {
            name: "available ",
            label: "machineAttributes.available",
            type: "switch",
            placeholder: "machineAttributes.available",
            required: true,
            parameterKey: "available",
            options: [],
            value: state?.attributes?.available
        },
        {
            name: "",
            label: "machineAttributes.markType",
            type: "select",
            placeholder: "machineAttributes.markType",
            required: true,
            parameterKey: "markType",
            options: [],
            value: state?.attributes?.printOverLaminate?.markType,
            multiple: true,
            disabled: !state?.attributes?.available
        },
        {
            name: "markLength",
            label: "machineAttributes.markLength",
            type: "text",
            placeholder: "machineAttributes.markLength",
            required: true,
            parameterKey: "markLength",
            options: [],
            value: state?.attributes?.markLength,
            unit: EMeasurementUnits.CM,
            disabled: !state?.attributes?.available
        },
        {
            name: "markWidth ",
            label: "machineAttributes.markWidth",
            type: "text",
            placeholder: "machineAttributes.markWidth",
            required: true,
            parameterKey: "markWidth",
            options: [],
            value: state?.attributes?.markWidth,
            unit: EMeasurementUnits.CM,
            disabled: !state?.attributes?.available
        },
    ];
}

export {widePrinting};