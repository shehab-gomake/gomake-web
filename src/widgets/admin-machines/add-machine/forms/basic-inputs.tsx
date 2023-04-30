import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const BasicInputsComponent = ({navigateNext, navigateBack, hasNext, hasBack}: IStepFormProps) => {
    const {classes} = useStyle();
    const {machineGeneralAttributes, machineBasicAttributes, changeMachineGeneralAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes()
    const onClickNext = () => {
        const s = isValidStep(machineGeneralAttributes);
        if (s) {

        navigateNext();
        }
    }
    const onClickBack = () => {
        navigateBack();
    }
    return (
        <>
            <div style={classes.container}>
                {
                    machineGeneralAttributes.map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineGeneralAttributes} error={errors[property.parameterKey]}/>
                    })
                }
                {
                    machineBasicAttributes().map((property: any) => {
                        return <InputContainer key={property.parameterKey} attribute={property}
                                               updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    })
                }
            </div>
            <NavigationButtons onClickNext={onClickNext} onClickBack={onClickBack} hasBack={hasBack} hasNext={hasNext}/>
        </>
    );
}

export {BasicInputsComponent};