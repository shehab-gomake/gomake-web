import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const inputs = (state) => {
    return [
        {
            name: 'machineAttributes.laserCutUnit',
            parameterKey: 'laserCutUnit',
            machineInputType: 'multiInput',
            value: state.attributes?.laserCutUnit ? state.attributes?.laserCutUnit : {},
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
                    value: state.attributes?.laserCutUnit?.isAvailable ? state.attributes?.laserCutUnit?.isAvailable : ''
                },
                {
                    name: "",
                    label: "machineAttributes.wasteCostCM2",
                    type: "text",
                    placeholder: "machineAttributes.wasteCostCM2",
                    required: true,
                    parameterKey: "cost",
                    options: [],
                    value: state.attributes?.laserCutUnit?.cost ? state.attributes?.laserCutUnit?.cost : '',
                    disabled: !state.attributes?.laserCutUnit?.isAvailable
                },
            ]
        },
    ]
}
const LaserUnitComponent = ({}: IStepFormProps) => {
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

export {LaserUnitComponent};