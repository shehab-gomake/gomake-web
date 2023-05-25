import {useStyle} from "@/widgets/machines/utils/forms/style";
import {NavigationButtons} from "@/widgets/machines/utils/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/machines/utils/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const MachineCoatingComponent = ({navigateNext, navigateBack, hasNext, hasBack, canAddMachine, canUpdate, onClickAdd, onClickUpdate}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineCoatingAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();
    const onClickNext = () => {
        const validStep = isValidStep(machineCoatingAttributes());
        if (validStep) {
            navigateNext();
        }
    }
    const onClickBack = () => {
        navigateBack();
    };

    const handleUpdate = () => {
        const validStep = isValidStep(machineCoatingAttributes());
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep(machineCoatingAttributes());
        if (validStep) {
            onClickAdd();
        }
    };
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                    machineCoatingAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property} updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/>        </div>
    );
}

export {MachineCoatingComponent};