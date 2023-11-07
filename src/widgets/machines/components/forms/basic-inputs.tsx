import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const BasicInputsComponent = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {
        machineGeneralAttributes,
        machineBasicAttributes,
        changeMachineGeneralAttributes,
        changeMachineAttributes,
        errors,
    } = useMachineAttributes()
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineGeneralAttributes.map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineGeneralAttributes}
                                               error={errors[property.parameterKey]}/>
                    })
                }
                {
                    machineBasicAttributes().map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes}
                                               error={errors[property.parameterKey]}/>
                    })
                }
            </div>

        </div>
    );
}

export {BasicInputsComponent};