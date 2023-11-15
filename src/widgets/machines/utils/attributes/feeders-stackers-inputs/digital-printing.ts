import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const digitalPrinting = (state: Record<string, any>) => {
    return [
        {
            name: 'machineAttributes.feeders',
            parameterKey: 'feeders',
            machineInputType: 'multiInput',
            value: state?.attributes?.feeders,
            isValid: !!state?.attributes?.feeders?.number &&
                !!state?.attributes?.feeders?.height &&
                !!state?.attributes?.feeders?.length &&
                !!state?.attributes?.feeders?.width ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.number",
                    type: "text",
                    placeholder: "machineAttributes.number",
                    required: true,
                    parameterKey: "number",
                    options: [],
                    value: state.attributes?.feeders?.number ? state.attributes?.feeders?.number : ''

                },
                {
                    name: "",
                    label: "machineAttributes.height",
                    type: "text",
                    unit: EMeasurementUnits.CM,
                    placeholder: "machineAttributes.height",
                    required: true,
                    parameterKey: "height",
                    options: [],
                    value: state.attributes?.feeders?.height ? state.attributes?.feeders?.height : ''

                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    required: true,
                    unit: EMeasurementUnits.CM,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.feeders?.length ? state.attributes?.feeders?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    required: true,
                    parameterKey: "width",
                    unit: EMeasurementUnits.CM,
                    options: [],
                    value: state.attributes?.feeders?.width ? state.attributes?.feeders?.width : ''

                },
            ]
        },
        {
            name: 'machineAttributes.Stackers',
            parameterKey: 'stackers',
            machineInputType: 'multiInput',
            value: state?.attributes?.stackers,
            isValid: !!state?.attributes?.stackers?.number &&
                !!state?.attributes?.stackers?.height &&
                !!state?.attributes?.stackers?.length &&
                !!state?.attributes?.stackers?.width ,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.number",
                    type: "text",
                    placeholder: "machineAttributes.number",
                    required: true,
                    parameterKey: "number",
                    options: [],
                    value: state.attributes?.stackers?.number ? state.attributes?.stackers?.number : ''

                },
                {
                    name: "",
                    label: "machineAttributes.height",
                    type: "text",
                    placeholder: "machineAttributes.height",
                    required: true,
                    unit: EMeasurementUnits.CM,
                    parameterKey: "height",
                    options: [],
                    value: state.attributes?.stackers?.height ? state.attributes?.stackers?.height : ''

                },
                {
                    name: "",
                    label: "machineAttributes.length",
                    type: "text",
                    placeholder: "machineAttributes.length",
                    unit: EMeasurementUnits.CM,
                    required: true,
                    parameterKey: "length",
                    options: [],
                    value: state.attributes?.stackers?.length ? state.attributes?.stackers?.length : ''

                },
                {
                    name: "",
                    label: "machineAttributes.width",
                    type: "text",
                    placeholder: "machineAttributes.width",
                    unit: EMeasurementUnits.CM,
                    required: true,
                    parameterKey: "width",
                    options: [],
                    value: state.attributes?.stackers?.width ? state.attributes?.stackers?.width : ''

                },
            ]
        },

    ]
};

export {digitalPrinting};