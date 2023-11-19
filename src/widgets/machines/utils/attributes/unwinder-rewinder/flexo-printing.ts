import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const flexoPrinting = (state: Record<string, any>) => {
    return [
        {
            name: "maxRewinderOutput",
            label: "machineAttributes.maxRewinderOutput",
            type: "text",
            placeholder: "machineAttributes.maxRewinderOutput",
            required: true,
            parameterKey: "maxRewinderOutput",
            options: [],
            value: state?.attributes?.maxRewinderOutput ? state?.attributes?.maxRewinderOutput : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxRewinderOutput,
        },
        {
            name: "maxUnwinderInput",
            label: "machineAttributes.maxUnwinderInput",
            type: "text",
            placeholder: "machineAttributes.maxUnwinderInput",
            required: true,
            parameterKey: "maxUnwinderInput",
            options: [],
            value: state?.attributes?.maxUnwinderInput ? state?.attributes?.maxUnwinderInput : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxUnwinderInput,
        },
        {
            name: "maxUnwinderRollWeight",
            label: "machineAttributes.maxUnwinderRollWeight",
            type: "text",
            placeholder: "machineAttributes.maxUnwinderRollWeight",
            required: true,
            parameterKey: "maxUnwinderRollWeight",
            options: [],
            value: state?.attributes?.maxUnwinderRollWeight ? state?.attributes?.maxUnwinderRollWeight : '',
            machineInputType: 'input',
            isValid: !!state?.attributes?.maxUnwinderRollWeight,
        },
        {
            name: 'machineAttributes.coreDiameter',
            parameterKey: 'coreDiameter',
            machineInputType: 'multiInput',
            value: state?.attributes?.coreDiameter,
            isValid: !!state?.attributes?.coreDiameter?.standard &&
                !!state?.attributes?.coreDiameter?.option,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.standard",
                    type: "text",
                    placeholder: "machineAttributes.standard",
                    required: true,
                    parameterKey: "standard",
                    unit: EMeasurementUnits.INCH,
                    options: [],
                    value: state.attributes?.coreDiameter?.standard ? state.attributes?.coreDiameter?.standard : ''
                },
                {
                    name: "",
                    label: "machineAttributes.option",
                    type: "text",
                    placeholder: "machineAttributes.option",
                    required: true,
                    parameterKey: "option",
                    unit: EMeasurementUnits.INCH,
                    options: [],
                    value: state.attributes?.coreDiameter?.option ? state.attributes?.coreDiameter?.option : ''

                },
            ]
        },


    ]
}


export {flexoPrinting};