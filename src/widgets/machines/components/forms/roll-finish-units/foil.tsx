import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const inputs = (state) => {
    return [
        {
            name: 'machineAttributes.foilUnit',
            parameterKey: 'foilUnit',
            machineInputType: 'multiInput',
            value: state.attributes?.foilUnit ? state.attributes?.foilUnit : {},
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
                    value: state.attributes?.foilUnit?.isAvailable ? state.attributes?.foilUnit?.isAvailable : ''
                },
                {
                    name: "",
                    label: "machineAttributes.digitalAnalog",
                    type: "select",
                    placeholder: "machineAttributes.digitalAnalog",
                    required: true,
                    parameterKey: "digitalAnalog",
                    options: [{value: 1, text: 'Digital'}, {value: 2, text: 'Analog'}],
                    value: state.attributes?.foilUnit?.digitalAnalog ? state.attributes?.foilUnit?.digitalAnalog : '',
                    disabled: !state.attributes?.foilUnit?.isAvailable
                },
                {
                    name: "setupTime",
                    label: "machineAttributes.setupTime",
                    type: "text",
                    placeholder: "machineAttributes.setupTime",
                    required: true,
                    parameterKey: "setupTime",
                    options: [{value: 1, text: 'Digital'}, {value: 2, text: 'Analog'}],
                    value: state.attributes?.foilUnit?.setupTime ? state.attributes?.foilUnit?.varnishTypes : '',
                    disabled: !state.attributes?.foilUnit?.isAvailable || state.attributes?.foilUnit?.digitalAnalog === 1
                },
                {
                    name: "",
                    label: "machineAttributes.operationMode",
                    type: "select",
                    placeholder: "machineAttributes.operationMode",
                    required: true,
                    parameterKey: "operationMode",
                    options: [{value: 1, text: 'continuous'}, {value: 2, text: 'regional'}],
                    value: state.attributes?.foilUnit?.operationMode ? state.attributes?.foilUnit?.operationMode : '',
                    disabled: !state.attributes?.foilUnit?.isAvailable
                },
                {
                    name: "",
                    label: "machineAttributes.foilOptions",
                    type: "select",
                    placeholder: "machineAttributes.foilOptions",
                    required: true,
                    parameterKey: "foilOptions",
                    options: [],
                    optionsUrl: '/v1/print-house-config/parameters/foil-options',
                    values: state.attributes?.foilUnit?.foilOptions ? state.attributes?.foilUnit?.foilOptions : '',
                    disabled: !state.attributes?.foilUnit?.isAvailable
                },
                {
                    name: "glueNeeded",
                    label: "machineAttributes.glueNeeded",
                    type: "switch",
                    placeholder: "machineAttributes.glueNeeded",
                    required: true,
                    parameterKey: "glueNeeded",
                    options: [],
                    value: state.attributes?.foilUnit?.glueNeeded ? state.attributes?.foilUnit?.glueNeeded : '',
                    disabled: !state.attributes?.foilUnit?.isAvailable
                },
            ]
        },
        state.attributes?.foilUnit?.isAvailable && state.attributes?.foilUnit?.glueNeeded ?
        {
            name: "machineAttributes.glues",
            label: "machineAttributes.glues",
            type: "text",
            placeholder: "machineAttributes.glues",
            required: true,
            parameterKey: "foilGlues",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.foilGlues,
            isValid: true,
            materialType: 'colors'
        } :
    {
        name: '',
            label: '',
        value: '',
        parameterKey: '',
        disabled: true
    },
    ]
}
const FoilUnitComponent = ({}: IStepFormProps) => {
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

export {FoilUnitComponent};