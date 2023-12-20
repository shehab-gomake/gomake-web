import {insertTypeInput} from "@/widgets/machines/utils/attributes/speed-inputs/insert- type-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const bookletMachine = (state: Record<string, any>) => {
    return [
        ...insertTypeInput(state),
        {
            name: "cellNumber",
            label: "machineAttributes.cellNumber",
            type: "text",
            placeholder: "machineAttributes.cellNumber",
            required: true,
            parameterKey: "cellNumber",
            value: state.attributes?.cellNumber,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "maxThicknessInCell",
            label: "machineAttributes.maxThicknessInCell",
            type: "text",
            placeholder: "machineAttributes.maxThicknessInCell",
            required: true,
            parameterKey: "maxThicknessInCell",
            options: [],
            value: state.attributes?.maxThicknessInCell ? state.attributes?.maxThicknessInCell : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxThicknessInCell,
            unit: EMeasurementUnits.MM
        },
        {
            name: "loadingInRun",
            label: "machineAttributes.loadingInRun",
            type: "switch",
            placeholder: "machineAttributes.loadingInRun",
            required: true,
            parameterKey: "loadingInRun",
            options: [],
            value: state.attributes?.loadingInRun ? state.attributes?.loadingInRun : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.loadingInRun,
        },
        {
            name: "cellChargingTime",
            label: "machineAttributes.cellChargingTime",
            type: "text",
            placeholder: "machineAttributes.cellChargingTime",
            required: true,
            parameterKey: "cellChargingTime",
            options: [],
            value: state.attributes?.cellChargingTime ? state.attributes?.cellChargingTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.cellChargingTime,
            unit: EMeasurementUnits.MINUTE
        },
    ]
}

export {bookletMachine};