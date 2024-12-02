import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const mediaAdvertisingProductsCategories = (state: Record<string, any>) => {
    return [
        {
            name: '',
            parameterKey: 'advertisingProducts',
            machineInputType: 'multiInput',
            value: state.attributes?.advertisingProducts ? state.attributes?.advertisingProducts : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.advertisingProducts",
                    type: "switch",
                    placeholder: "machineAttributes.advertisingProducts",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.advertisingProducts?.isAvailable ? state.attributes?.advertisingProducts?.isAvailable : ''
                },
                {
                    name: "categories",
                    label: "machineAttributes.categories",
                    type: "select",
                    placeholder: "machineAttributes.categories",
                    required: true,
                    parameterKey: "categories",
                    options: [],
                    value: state?.attributes?.advertisingProducts?.categories,
                    optionsUrl: '/v1/materials/get-all-print-house-material-categories?material=Advertising Products',
                    multiple: true,
                    disabled: !state.attributes?.advertisingProducts?.isAvailable
                },
                {
                    name: "printingInWidth",
                    label: "machineAttributes.printingInWidth",
                    type: "text",
                    placeholder: "machineAttributes.printingInWidth",
                    required: true,
                    parameterKey: "printingInWidth",
                    options: [],
                    value: state.attributes?.advertisingProducts?.printingInWidth ? state.attributes?.advertisingProducts?.printingInWidth : '',
                    disabled: !state.attributes?.advertisingProducts?.isAvailable,
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "printingInLength",
                    label: "machineAttributes.printingInLength",
                    type: "text",
                    placeholder: "machineAttributes.printingInLength",
                    required: true,
                    parameterKey: "printingInLength",
                    options: [],
                    value: state.attributes?.advertisingProducts?.printingInLength ? state.attributes?.advertisingProducts?.printingInLength : '',
                    disabled: !state.attributes?.advertisingProducts?.isAvailable,
                    unit: EMeasurementUnits.CM
                },
            ]
        },
    ]
}


export {mediaAdvertisingProductsCategories};