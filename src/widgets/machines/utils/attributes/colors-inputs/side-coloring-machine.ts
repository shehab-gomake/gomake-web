import {COLORS} from "@/widgets/machines/utils/const";

const sideColoringMachine = (state: Record<string, any>) => {
    return [
        {
            name: "color",
            label: "machineAttributes.color",
            type: "select",
            placeholder: "machineAttributes.color",
            required: true,
            parameterKey: "color",
            value: state.attributes.color,
            options:  COLORS,
            isValid: true
        },
    ]
};


export {sideColoringMachine}