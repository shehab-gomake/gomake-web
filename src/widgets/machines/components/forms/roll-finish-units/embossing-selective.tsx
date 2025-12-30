import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";
import {EMeasurementUnits} from "@/widgets/machines/enums/measurement-units";

const inputs = (state) => {
    return [
        {
            name: 'machineAttributes.embossingSelective',
            parameterKey: 'embossingSelective',
            machineInputType: 'multiInput',
            value: state.attributes?.embossingSelective ? state.attributes?.embossingSelective : {},
            isValid: true,
            inputs: [
                {
                    name: "isAvailable",
                    label: "machineAttributes.isAvailable",
                    type: "switch",
                    placeholder: "machineAttributes.isAvailable",
                    required: true,
                    parameterKey: "isAvailable",
                    options: [],
                    value: state.attributes?.embossingSelective?.isAvailable ? state.attributes?.embossingSelective?.isAvailable : ''
                },
                {
                    name: "",
                    label: "machineAttributes.digitalAnalog",
                    type: "select",
                    placeholder: "machineAttributes.digitalAnalog",
                    required: true,
                    parameterKey: "digitalAnalog",
                    options: [{value: 1, text: 'Digital'}, {value: 2, text: 'Analog'}],
                    value: state.attributes?.embossingSelective?.digitalAnalog ? state.attributes?.embossingSelective?.digitalAnalog : '',
                    disabled: !state.attributes?.embossingSelective?.isAvailable
                },
                {
                    name: "setupTime",
                    label: "machineAttributes.setupTime",
                    type: "text",
                    placeholder: "machineAttributes.setupTime",
                    required: true,
                    parameterKey: "setupTime",
                    options: [{value: 1, text: 'Digital'}, {value: 2, text: 'Analog'}],
                    value: state.attributes?.embossingSelective?.setupTime ? state.attributes?.embossingSelective?.varnishTypes : '',
                    disabled: !state.attributes?.embossingSelective?.isAvailable || state.attributes?.embossingSelective?.digitalAnalog === 1
                },
            ]
        },
        {
            name: "machineAttributes.varnishTypes",
            label: "machineAttributes.varnishTypes",
            type: "text",
            placeholder: "machineAttributes.varnishTypes",
            required: true,
            parameterKey: "foilVarnishTypes",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.foilVarnishTypes,
            isValid: true,
            materialType: 'varnish',
            disabled: !state.attributes?.embossingSelective?.isAvailable

        },
        {
            name: 'machineAttributes.heightLevels',
            parameterKey: 'heightLevelsList',
            value: state?.attributes?.heightLevelsList ? state?.attributes?.heightLevelsList : [],
            machineInputType: 'multiArrayInput',
            isValid: state?.attributes?.heightLevelsList?.length > 0,
            disabled: !state.attributes?.embossingSelective?.isAvailable,
            inputs: [
                {
                    name: "",
                    label: "machineAttributes.heightLevel",
                    type: "text",
                    placeholder: "machineAttributes.heightLevel",
                    required: true,
                    parameterKey: "value",
                    options: []
                },
                {
                    name: "",
                    label: "machineAttributes.WeightOfVarnish",
                    type: "text",
                    placeholder: "machineAttributes.WeightOfVarnish",
                    required: true,
                    parameterKey: "weightPerArea",
                    options: [],
                    unit: EMeasurementUnits.KgPerSquareMeter
                }
            ]
        },
    ]
}
const EmbossingUnitComponent = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {
        machineState,
        changeMachineAttributes,
        errors,
    } = useMachineAttributes()
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    inputs(machineState).map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes}
                                               error={errors[property.parameterKey]}/>
                    })
                }
            </div>

        </div>
    );
}

export {EmbossingUnitComponent};