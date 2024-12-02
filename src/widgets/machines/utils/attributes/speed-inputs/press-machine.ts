import {setupTimeInput} from "@/widgets/machines/utils/attributes/speed-inputs/setup-time-input";

const pressMachine = (state: Record<string, any>) => {
    return [
        ...setupTimeInput(state),
        {
            name: 'machineAttributes.pressStationsByAdvertisingProducts',
            parameterKey: 'pressStationsByAdvertisingProducts',
            value: state.attributes?.pressStationsByAdvertisingProducts || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "advertisingProducts",
                    label: "machineAttributes.advertisingProducts",
                    type: "select",
                    placeholder: "machineAttributes.advertisingProducts",
                    required: true,
                    parameterKey: "advertisingProducts",
                    options: [],
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=Advertising Products'
                },
                {
                    name: "stations",
                    label: "machineAttributes.stations",
                    type: "text",
                    placeholder: "machineAttributes.stations",
                    required: true,
                    parameterKey: "stations",
                    options: []
                },
            ]
        },
        {
            name: 'machineAttributes.pressTimeByAdvertisingProducts',
            parameterKey: 'pressTimeByAdvertisingProducts',
            value: state.attributes?.pressTimeByAdvertisingProducts || [],
            machineInputType: 'multiArrayInput',
            isValid: true,
            inputs: [
                {
                    name: "advertisingProducts",
                    label: "machineAttributes.advertisingProducts",
                    type: "select",
                    placeholder: "machineAttributes.advertisingProducts",
                    required: true,
                    parameterKey: "advertisingProducts",
                    options: [],
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=Advertising Products'
                },
                {
                    name: "pressTime",
                    label: "machineAttributes.pressTime",
                    type: "text",
                    placeholder: "machineAttributes.pressTime",
                    required: true,
                    parameterKey: "pressTime",
                    options: []
                },
            ]
        },
    ]
}

export {pressMachine};