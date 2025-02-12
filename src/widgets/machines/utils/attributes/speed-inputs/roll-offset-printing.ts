import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {printingGeneral} from "@/widgets/machines/utils/attributes/speed-inputs/printing-general";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";
import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const rollOffsetPrinting = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        ...maxSpeedInput(state, EMeasurementUnits.METER_P_MIN),
        {
            name: 'machineAttributes.setupTimeSheetWaste',
            parameterKey: 'setupTimeSheetWaste',
            value: state.attributes?.setupTimeSheetWaste || [],
            machineInputType: 'multiArrayInput',
            isValid: state.attributes?.setupTimeSheetWaste?.length > 0,
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.upToMediaWeight",
                    type: "text",
                    placeholder: "machineAttributes.upToMediaWeight",
                    unit: EMeasurementUnits.GRAM,
                    required: true,
                    parameterKey: "mediaWeight",
                    options: []
                },
                {
                    name: "sheetLost",
                    label: "machineAttributes.mediaSheetsLoss",
                    type: "text",
                    placeholder: "machineAttributes.mediaSheetsLoss",
                    required: true,
                    parameterKey: "sheetsLoss",
                    options: []
                },
            ]
        },
        {
            name: 'machineAttributes.setupTimeByWeight',
            parameterKey: 'setupTime',
            value: state.attributes?.setupTime || [],
            machineInputType: 'multiArrayInput',
            isValid: state.attributes?.setupTime?.length > 0,
            inputs: [
                {
                    name: "weight",
                    label: "machineAttributes.upToMediaWeight",
                    type: "text",
                    placeholder: "machineAttributes.upToMediaWeight",
                    unit: EMeasurementUnits.GRAM,
                    required: true,
                    parameterKey: "mediaWeight",
                    options: []
                },
                {
                    name: "time",
                    label: "machineAttributes.time",
                    type: "text",
                    unit: EMeasurementUnits.MINUTE,
                    placeholder: "machineAttributes.time",
                    required: true,
                    parameterKey: "time",
                    options: []
                },
            ]
        },
        ...printingGeneral(state, EMeasurementUnits.METER_P_MIN).filter(a => a.parameterKey !== 'speedByColorBySize'),
        ]
}


export {rollOffsetPrinting};


