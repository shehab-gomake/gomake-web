import {useStyle} from "@/widgets/machines/utils/forms/style";
import {IStepFormProps} from "@/widgets/machines/utils/forms/interface";
import {NavigationButtons} from "@/widgets/machines/utils/forms/navigationButtons";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

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