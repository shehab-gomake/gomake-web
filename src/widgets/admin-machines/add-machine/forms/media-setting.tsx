import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const MediaSettingComponent = ({navigateNext, navigateBack, hasBack, hasNext, onClickUpdate, canUpdate, canAddMachine, onClickAdd}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineMediaAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();
    const onClickNext = () => {
        const validStep = isValidStep(machineMediaAttributes());
        if (validStep) {
            navigateNext();
        }
    };

    const onClickBack = () => {
        navigateBack();
    };
    const handleUpdate = () => {
        const validStep = isValidStep(machineMediaAttributes());
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep(machineMediaAttributes());
        if (validStep) {
            onClickAdd();
        }
    };
    return (
        <div style={classes.container}>
            <div style={classes.inputsContainer}>
                {
                   machineMediaAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property} updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/>        </div>
    );
};

export {MediaSettingComponent}