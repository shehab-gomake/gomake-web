import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";
import {rollFinishUnits} from "@/widgets/machines/utils/const/roll-finish-units";

const rollLaserCutMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: "maxSpeed",
            label: "machineAttributes.maxSpeed",
            type: "text",
            placeholder: "machineAttributes.maxSpeed",
            required: true,
            parameterKey: "maxSpeed",
            options: [],
            value: state?.attributes?.maxSpeed ? state?.attributes?.maxSpeed : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxSpeed,
            unit: EMeasurementUnits.METER_P_MIN
        },
        {
            name: 'machineAttributes.stopTimePerRoll',
            parameterKey: 'stopTimePerRoll',
            machineInputType: 'multiInput',
            value: state.attributes?.stopTimePerRoll ? state.attributes?.stopTimePerRoll : {},
            isValid: !!state?.attributes?.stopTimePerRoll?.firstColumn &&
                !!state?.attributes?.stopTimePerRoll?.forEachAdditionalColumn &&
                !!state?.attributes?.stopTimePerRoll?.forEachAdditionalColumnStraightKnife,

            inputs: [
                {
                    name: "",
                    label: "machineAttributes.firstColumn",
                    type: "text",
                    placeholder: "machineAttributes.firstColumn",
                    required: true,
                    parameterKey: "firstColumn",
                    options: [],
                    value: state.attributes?.stopTimePerRoll?.firstColumn ? state.attributes?.stopTimePerRoll?.firstColumn : '',
                    unit: EMeasurementUnits.MINUTE
                },
                {
                    name: "",
                    label: "machineAttributes.forEachAdditionalColumn",
                    type: "text",
                    placeholder: "machineAttributes.forEachAdditionalColumn",
                    required: true,
                    parameterKey: "forEachAdditionalColumn",
                    options: [],
                    value: state.attributes?.stopTimePerRoll?.forEachAdditionalColumn ? state.attributes?.stopTimePerRoll?.forEachAdditionalColumn : '',
                    unit: EMeasurementUnits.MINUTE

                },
                {
                    name: "",
                    label: "machineAttributes.forEachAdditionalColumnStraightKnife",
                    type: "text",
                    placeholder: "machineAttributes.forEachAdditionalColumnStraightKnife",
                    required: true,
                    parameterKey: "forEachAdditionalColumnStraightKnife",
                    options: [],
                    value: state.attributes?.stopTimePerRoll?.forEachAdditionalColumnStraightKnife ? state.attributes?.stopTimePerRoll?.forEachAdditionalColumnStraightKnife : '',
                    unit: EMeasurementUnits.MINUTE

                },
            ]
        },
        {
            name: 'machineAttributes.speedByUnits',
            parameterKey: 'speedByUnits',
            value: state.attributes?.speedByUnits || [],
            isValid: state.attributes?.speedByUnits?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "unit",
                    label: "machineAttributes.unit",
                    type: "select",
                    placeholder: "machineAttributes.unit",
                    required: true,
                    parameterKey: "unit",
                    options: rollFinishUnits(),
                    optionsUrl: ''
                },
                {
                    name: "percentage",
                    label: "machineAttributes.percentage",
                    type: "text",
                    placeholder: "machineAttributes.percentage",
                    required: true,
                    parameterKey: "percentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },
            ]
        },
        {
            name: 'machineAttributes.speedByRollMedia',
            parameterKey: 'speedByMediaType',
            value: state.attributes?.speedByMediaType || [],
            isValid: state.attributes?.speedByMediaType?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "mediaType",
                    label: "machineAttributes.mediaType",
                    type: "select",
                    placeholder: "machineAttributes.mediaType",
                    required: true,
                    parameterKey: "mediaType",
                    options: [],
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=roll printing'
                },
                {
                    name: "percentage",
                    label: "machineAttributes.percentage",
                    type: "text",
                    placeholder: "machineAttributes.percentage",
                    required: true,
                    parameterKey: "percentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },
            ]
        },
        {
            name: 'machineAttributes.speedByComplexity',
            parameterKey: 'speedByShapeComplexity',
            value: state.attributes?.speedByShapeComplexity || [],
            isValid: state.attributes?.speedByShapeComplexity?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "shape",
                    label: "machineAttributes.shape",
                    type: "select",
                    placeholder: "machineAttributes.shape",
                    required: true,
                    parameterKey: "shape",
                    options: [],
                    optionsUrl: '/v1/print-house-config/parameters/shape-complexity'
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "number",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: [],
                    unit: EMeasurementUnits.PERCENTAGE
                },

            ]
        },
        {
            name: 'machineAttributes.speedByLength',
            parameterKey: 'speedBySize',
            value: state.attributes?.speedBySize || [],
            isValid: state.attributes?.speedBySize?.length > 0,
            machineInputType: 'multiArrayInput',
            inputs: [
                {
                    name: "upCm",
                    label: "machineAttributes.upCm",
                    type: "text",
                    placeholder: "machineAttributes.upCm",
                    required: true,
                    parameterKey: "upCm",
                    options: []
                },
                {
                    name: "speedPercentage",
                    label: "machineAttributes.speedPercentage",
                    type: "text",
                    placeholder: "machineAttributes.speedPercentage",
                    required: true,
                    parameterKey: "speedPercentage",
                    options: []
                },
            ]
        }
    ]
}

export {rollLaserCutMachine};