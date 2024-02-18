import {mediaThicknessSettings} from "@/widgets/machines/utils/attributes/media-inputs/media-thickness-settings";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const bookBinderMachine = (state: Record<string, any>) => {
    return [
        {
            name: "paperCategoriesSuitable",
            label: "machineAttributes.paperCategoriesSuitable",
            type: "select",
            placeholder: "machineAttributes.paperCategoriesSuitable",
            required: true,
            parameterKey: "paperCategoriesSuitable",
            value: state.attributes?.doubleHead,
            options: [{value: 0, text: 'Option 1'}, {value: 2, text: 'Option 2'}],
            machineInputType: 'input',
            isValid: true,
        },
        {
            name: "mediaCoatingType",
            label: "machineAttributes.mediaCoatingType",
            type: "select",
            placeholder: "machineAttributes.mediaCoatingType",
            required: true,
            parameterKey: "mediaCoatingType",
            options: [{text: 'coated', value: 'coated'}, {text: 'uncoated', value: 'uncoated'}],
            values: state?.attributes?.mediaCoatingType,
            multiple: true
        },
        ...mediaThicknessSettings(state),
        {
            name: 'machineAttributes.width',
            parameterKey: 'width',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.width?.min &&
                !!state?.attributes?.width?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.width?.min ? state.attributes?.width?.min : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.width?.max ? state.attributes?.width?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.length',
            parameterKey: 'length',
            machineInputType: 'multiInput',
            isValid: !!state?.attributes?.length?.min &&
                !!state?.attributes?.length?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.length?.min ? state.attributes?.length?.min : '',
                    unit: EMeasurementUnits.CM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.length?.max ? state.attributes?.length?.max : '',
                    unit: EMeasurementUnits.CM
                },
            ]
        },
        {
            name: 'machineAttributes.paperThickness',
            parameterKey: 'paperThickness',
            machineInputType: 'multiInput',
            value: state?.attributes?.paperThickness,
            isValid: !!state?.attributes?.paperThickness?.min &&
                !!state?.attributes?.paperThickness?.max,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.min",
                    type: "text",
                    placeholder: "machineAttributes.min",
                    required: true,
                    parameterKey: "min",
                    options: [],
                    value: state.attributes?.paperThickness?.min ? state.attributes?.paperThickness?.min : '',
                    unit: EMeasurementUnits.UM
                },
                {
                    name: "",
                    label: "machineAttributes.max",
                    type: "text",
                    placeholder: "machineAttributes.max",
                    required: true,
                    parameterKey: "max",
                    options: [],
                    value: state.attributes?.paperThickness?.max ? state.attributes?.paperThickness?.max : '',
                    unit: EMeasurementUnits.UM
                },
            ]
        },
    ]
}


export {bookBinderMachine};