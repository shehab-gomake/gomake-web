import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {minMaxInput} from "@/widgets/machines/utils/attributes/media-inputs/min-max-input";
import { acceptedSets } from "../connection-inputs/accepted-sets";

const bookletMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...minMaxInput(state, 'width', 'widthInRunningDirection', EMeasurementUnits.CM),
        ...minMaxInput(state, 'length', 'lengthInRunningDirection', EMeasurementUnits.CM),
        ...minMaxInput(state, 'paperThickness', 'paperThickness', EMeasurementUnits.UM),
        {
            name: "",
            label: "machineAttributes.maxThicknessBeforeFolding",
            type: "text",
            placeholder: "machineAttributes.maxThicknessBeforeFolding",
            required: true,
            parameterKey: "maxThicknessBeforeFolding",
            options: [],
            value: state.attributes?.maxThicknessBeforeFolding ? state.attributes?.maxThicknessBeforeFolding : '',
            unit: EMeasurementUnits.MM
        },
        {
            name: "squareSpineOption",
            label: "machineAttributes.squareSpineOption",
            type: "switch",
            placeholder: "machineAttributes.squareSpineOption",
            required: true,
            parameterKey: "squareSpineOption",
            value: state.attributes?.squareSpineOption,
            options: [],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "delayBetweenUnitTime",
            label: "machineAttributes.delayBetweenUnitTime",
            type: "number",
            placeholder: "machineAttributes.delayBetweenUnitTime",
            required: false,
            parameterKey: "delayBetweenUnitTime",
            options: [],
            value: state?.attributes?.delayBetweenUnitTime,
            machineInputType: 'input',
            isValid: !!state?.attributes?.delayBetweenUnitTime,
            disabled: !state?.attributes?.squareSpineOption,
            unit: EMeasurementUnits.SECOND
        },
        ...acceptedSets(state),
    ]
}


export {bookletMachine};