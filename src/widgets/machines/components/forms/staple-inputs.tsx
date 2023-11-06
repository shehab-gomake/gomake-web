import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const StapleInputsComponent = ({navigateBack, navigateNext, hasBack, hasNext, canAddMachine, canUpdate, onClickAdd, onClickUpdate}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineStapleAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();

    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineStapleAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property}
                                        updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
        </div>
    );
}

export {StapleInputsComponent};