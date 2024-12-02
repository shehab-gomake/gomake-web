import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const cncMachine = (state: Record<string, any>) => {
    return [
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
            unit: EMeasurementUnits.CM
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
            unit: EMeasurementUnits.CM

        },
    ];
}

export {cncMachine};