import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const inputs = (state) => {
    return [
        {
            name: 'machineAttributes.varnishUnit',
            parameterKey: 'varnishUnit',
            machineInputType: 'multiInput',
            value: state.attributes?.varnishUnit ? state.attributes?.varnishUnit : {},
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
                    value: state.attributes?.varnishUnit?.isAvailable ? state.attributes?.varnishUnit?.isAvailable : ''
                },
            ]
        },
        state.attributes?.varnishUnit?.isAvailable ?
        {
            name: "machineAttributes.varnishTypes",
            label: "machineAttributes.varnishTypes",
            type: "text",
            placeholder: "machineAttributes.varnishTypes",
            required: true,
            parameterKey: "varnishTypes",
            options: [],
            machineInputType: 'materialInput',
            value: state?.attributes?.varnishTypes,
            isValid: true,
            materialType: 'varnish'
        } :
            {
                name: '',
                label: '',
                value: '',
                parameterKey: '',
                disabled: true
            }
        ,
    ]
}
const VarnishUnitComponent = ({}: IStepFormProps) => {
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

export {VarnishUnitComponent};