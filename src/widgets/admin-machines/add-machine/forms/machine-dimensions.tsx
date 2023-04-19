import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const MachineDimensionsComponent = ({navigateNext, navigateBack}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineDimensionsAttributes, changeMachineAttributes, errors} = useMachineAttributes();
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
                   machineDimensionsAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property} updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
            <NavigationButtons onClickNext={onClickNext} onClickBack={onClickBack} hasBack={true} hasNext={true}/>
        </>
    );
}

export {MachineDimensionsComponent};