import {COLOR_TYPES} from "@/widgets/machines/utils/const";

const basicColorsInput = (state: Record<string, any>) => {
    return [
        {
            name: "basicsColors",
            label: "machineAttributes.basicsColors",
            type: "select",
            placeholder: "machineAttributes.basicsColors",
            required: true,
            parameterKey: "basicsColors",
            value: state?.attributes?.basicsColors,
            options: [{value: 1, text: 'Black'}, {value: 2, text: 'CMYK'}],
            machineInputType: 'input',
            isValid: true
        },
    ]
};


export {basicColorsInput}