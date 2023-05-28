import {useStyle} from "@/widgets/machines/components/forms/style";
import {NavigationButtons} from "@/widgets/machines/components/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import {useMachineAttributes} from "@/widgets/machines/hooks/use-machine-attributes";

const BasicInputsComponent = ({
                                  navigateNext,
                                  navigateBack,
                                  hasNext,
                                  hasBack,
                                  canUpdate,
                                  onClickUpdate,
                                  onClickAdd,
                                  canAddMachine
                              }: IStepFormProps) => {
    const {classes} = useStyle();
    const {
        machineGeneralAttributes,
        machineBasicAttributes,
        changeMachineGeneralAttributes,
        changeMachineAttributes,
        errors,
        isValidStep
    } = useMachineAttributes()
    const onClickNext = () => {
        const validStep = isValidStep([...machineGeneralAttributes, ...machineBasicAttributes()]);
        if (validStep) {
            navigateNext();
        }
    }
    const onClickBack = () => {
        navigateBack();
    }
    const handleUpdate = () => {
        const validStep = isValidStep([...machineGeneralAttributes, ...machineBasicAttributes()]);
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep([...machineGeneralAttributes, ...machineBasicAttributes()]);
        if (validStep) {
            onClickAdd();
        }
    };
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
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/>
        </div>
    );
}

export {BasicInputsComponent};