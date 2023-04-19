import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const MediaSettingComponent = ({navigateNext, navigateBack, hasBack, hasNext}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineMediaAttributes, changeMachineAttributes, errors} = useMachineAttributes();
    const onClickNext = () => {
            navigateNext();
    };

    const onClickBack = () => {
        navigateBack();
    }
    return (
        <>
            <div style={classes.container}>
                {
                   machineMediaAttributes().map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property} updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
            <NavigationButtons onClickNext={onClickNext} onClickBack={onClickBack} hasBack={hasBack} hasNext={hasNext}/>
        </>
    );
};

export {MediaSettingComponent}