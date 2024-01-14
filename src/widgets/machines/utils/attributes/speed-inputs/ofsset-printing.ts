import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {printingGeneral} from "@/widgets/machines/utils/attributes/speed-inputs/printing-general";
import {maxSpeedInput} from "@/widgets/machines/utils/attributes/speed-inputs/max-speed-input";

const ofssetPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "stationWashTime",
            label: "machineAttributes.stationWashTime",
            type: "text",
            placeholder: "machineAttributes.stationWashTime",
            required: true,
            parameterKey: "stationWashTime",
            unit: EMeasurementUnits.MINUTE,
            options: [],
            value: state?.attributes?.stationWashTime ? state?.attributes?.stationWashTime : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.stationWashTime,
        },
        ...maxSpeedInput(state, EMeasurementUnits.PPM),
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
        ...printingGeneral(state),
        ]
}


export {ofssetPrinting};


