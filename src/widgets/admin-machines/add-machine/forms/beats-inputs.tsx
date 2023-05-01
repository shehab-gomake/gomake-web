import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const BeatsInputsComponent = ({navigateNext, navigateBack, hasNext, hasBack, canUpdate, canAddMachine, onClickAdd, onClickUpdate}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineBeatsAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();
    const onClickNext = () => {
        const validStep = isValidStep(machineBeatsAttributes());
        if (validStep) {
            navigateNext();
        }
    }
    const onClickBack = () => {
        navigateBack();
    }

    const handleUpdate = () => {
        const validStep = isValidStep(machineBeatsAttributes());
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep(machineBeatsAttributes());
        if (validStep) {
            onClickAdd();
        }
    };
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
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/>
        </div>
    );
}

export {BeatsInputsComponent};