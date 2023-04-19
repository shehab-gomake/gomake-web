import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const ColorsInputsComponent = ({navigateBack, navigateNext, hasBack, hasNext}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineColorsAttributes, changeMachineAttributes, errors} = useMachineAttributes();
    const onClickBack = () => {
        navigateBack();
    }
    const onClickNext = () => {
        navigateNext();
    }
    const submit = () => {
            navigateNext();
    }

    return (
        <>
        <div style={classes.container}>
            {
              machineColorsAttributes().map((property: any) => (
                    <InputContainer key={property.parameterKey} attribute={property} updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                ))
            }
        </div>
            <NavigationButtons onClickNext={onClickNext} onClickBack={onClickBack} hasBack={hasBack} hasNext={hasNext}/>
    </>
            );
}

export {ColorsInputsComponent};