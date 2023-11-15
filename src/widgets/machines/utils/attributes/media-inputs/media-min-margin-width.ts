import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const mediaMinMarginWidth = (state: Record<string, any>) => {
    return [
        {
            name: "minWidthMarginWithoutPrinting",
            label: "machineAttributes.minWidthMarginWithoutPrinting",
            type: "text",
            placeholder: "machineAttributes.minWidthMarginWithoutPrinting",
            required: true,
            parameterKey: "minWidthMarginWithoutPrinting",
            unit: EMeasurementUnits.MM,
            options: [],
            value: state?.attributes?.minWidthMarginWithoutPrinting ? state?.attributes?.minWidthMarginWithoutPrinting : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.minWidthMarginWithoutPrinting,
        },
    ]
}


export {mediaMinMarginWidth};