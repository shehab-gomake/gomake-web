import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {useState} from "react";
import {ESpeedInputMethods} from "@/widgets/admin-machines/add-machine/inputs/speed-inputs/digital-printing";
import {Button, ButtonGroup} from "@mui/material";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";

const SpeedSettingsComponent = ({navigateBack, navigateNext, hasBack, hasNext}: IStepFormProps) => {
    const [state, setState] = useState<ESpeedInputMethods>(ESpeedInputMethods.COLOR_SPEED);
    const {classes} = useStyle();
    const {machineSpeedAttributes, changeMachineAttributes, errors} = useMachineAttributes();
    const onClickNext = () => {
        navigateNext();
    }
    const onClickBack = () => {
        navigateBack();
    }

    const inputs: (method: ESpeedInputMethods) => any[] = machineSpeedAttributes();
    return (
        <>
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                <Button onClick={() => setState(ESpeedInputMethods.COLOR_SPEED)}>One</Button>
                <Button onClick={() => setState(ESpeedInputMethods.COLOR_SIZE_SPEED)}>Two</Button>
            </ButtonGroup>
            <div>
                {
                    inputs(state).map((property: any) => (
                        <InputContainer key={property.parameterKey} attribute={property} updateState={changeMachineAttributes} error={errors[property.parameterKey]}/>
                    ))
                }
            </div>
            <NavigationButtons onClickNext={onClickNext} onClickBack={onClickBack} hasBack={hasBack} hasNext={hasNext}/>
        </>
    );
};

export {SpeedSettingsComponent};