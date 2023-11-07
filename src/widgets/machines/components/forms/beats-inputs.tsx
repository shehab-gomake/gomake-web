import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const BeatsInputsComponent = ({}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineBeatsAttributes, changeMachineAttributes, errors} = useMachineAttributes();

    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineBeatsAttributes().map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    })
                }
            </div>
        </div>
    );
}

export {BeatsInputsComponent};