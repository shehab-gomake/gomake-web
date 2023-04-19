import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const BeatsInputsComponent = ({navigateNext, navigateBack, hasNext, hasBack}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineBeatsAttributes, changeMachineAttributes, errors} = useMachineAttributes();
    const onClickNext = () => {
        navigateNext();
    }
    const onClickBack = () => {
        navigateBack();
    }
    return (
        <>
            <div style={classes.container}>
                {
                    machineBeatsAttributes().map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    })
                }
            </div>
            <NavigationButtons onClickNext={onClickNext} onClickBack={onClickBack} hasBack={hasBack} hasNext={hasNext}/>
        </>
    );
}

export {BeatsInputsComponent};