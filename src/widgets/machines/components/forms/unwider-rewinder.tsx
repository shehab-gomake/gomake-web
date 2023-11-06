import {useStyle} from "@/widgets/machines/components/forms/style";
import {NavigationButtons} from "@/widgets/machines/components/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const UnwiderRewinderComponent = ({navigateBack, navigateNext, hasBack, hasNext, canAddMachine, canUpdate, onClickAdd, onClickUpdate}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineUnWinderAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();
    const onClickBack = () => {
       navigateBack();
    }
    const onClickNext = () => {
        const validStep = isValidStep(machineUnWinderAttributes());
        if (validStep) {
            navigateNext();
        }
    }

    const handleUpdate = () => {
        const validStep = isValidStep(machineUnWinderAttributes());
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep(machineUnWinderAttributes());
        if (validStep) {
            onClickAdd();
        }
    };

    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineUnWinderAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property}
                                        updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
            {/*<NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}*/}
            {/*                   onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}*/}
            {/*                   hasBack={hasBack} hasNext={hasNext}/>   */}
        </div>
    );
}

export {UnwiderRewinderComponent};