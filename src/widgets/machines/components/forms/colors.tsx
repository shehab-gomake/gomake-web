import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const ColorsInputsComponent = ({navigateBack, navigateNext, hasBack, hasNext, canAddMachine, canUpdate, onClickAdd, onClickUpdate}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineColorsAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();

    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineColorsAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property}
                                        updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>

        </div>
    );
}

export {ColorsInputsComponent};