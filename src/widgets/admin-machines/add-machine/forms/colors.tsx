import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const ColorsInputsComponent = ({navigateBack, navigateNext, hasBack, hasNext, canAddMachine, canUpdate, onClickAdd, onClickUpdate}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineColorsAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();
    const onClickBack = () => {
       navigateBack();
    }
    const onClickNext = () => {
        const validStep = isValidStep(machineColorsAttributes());
        if (validStep) {
            navigateNext();
        }
    }

    const handleUpdate = () => {
        const validStep = isValidStep(machineColorsAttributes());
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep(machineColorsAttributes());
        if (validStep) {
            onClickAdd();
        }
    };

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
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/>        </div>
    );
}

export {ColorsInputsComponent};