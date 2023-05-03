import {useStyle} from "@/widgets/admin-machines/add-machine/forms/style";
import {NavigationButtons} from "@/widgets/admin-machines/add-machine/forms/navigationButtons";
import {IStepFormProps} from "@/widgets/admin-machines/add-machine/forms/interface";
import {InputContainer} from "@/widgets/admin-machines/components/input-container";
import {ChangeEvent, useState} from "react";
import {ESpeedInputMethods} from "@/widgets/admin-machines/add-machine/inputs/speed-inputs/digital-printing";
import {Typography} from "@mui/material";
import {useMachineAttributes} from "@/widgets/admin-machines/hooks/use-machine-attributes";
import {StyledSwitch} from "@/widgets/admin-machines/components/switch";
import {Stack} from "@mui/system";
import {useTranslation} from "react-i18next";

const SpeedSettingsComponent = ({
                                    navigateBack,
                                    navigateNext,
                                    hasBack,
                                    hasNext,
                                    canUpdate,
                                    onClickUpdate,
                                    onClickAdd,
                                    canAddMachine
                                }: IStepFormProps) => {
    const [state, setState] = useState<ESpeedInputMethods>(ESpeedInputMethods.COLOR_SPEED);
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {machineSpeedAttributes, changeMachineAttributes, errors, isValidStep} = useMachineAttributes();
    const onClickNext = () => {
        const validStep = isValidStep(inputs(state));
        if (validStep) {
            navigateNext();
        }
    }
    const onClickBack = () => {
        navigateBack();
    };

    const handleUpdate = () => {
        const validStep = isValidStep(inputs(state));
        if (validStep) {
            onClickUpdate();
        }
    };
    const handleAddMachine = () => {
        const validStep = isValidStep(inputs(state));
        if (validStep) {
            onClickAdd();
        }
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setState(event.target.checked ? ESpeedInputMethods.COLOR_SIZE_SPEED : ESpeedInputMethods.COLOR_SPEED);
    };

    const inputs: (method: ESpeedInputMethods) => any[] = machineSpeedAttributes();
    return (

        <div style={classes.container}>
            <div>
                <Stack direction="row" spacing={1} alignItems="center">
                    <StyledSwitch checked={state === ESpeedInputMethods.COLOR_SIZE_SPEED} onChange={handleChange}/>
                    <Typography>{t('Rated speed by paper size')}</Typography>
                </Stack>
                <div>
                    {
                        inputs(state).map((property: any) => (
                            <InputContainer key={property.parameterKey} attribute={property}
                                            updateState={changeMachineAttributes}
                                            error={errors[property.parameterKey]}/>
                        ))
                    }
                </div>
            </div>
            <NavigationButtons canAddMachine={canAddMachine} canUpdate={canUpdate} onClickAddMachine={handleAddMachine}
                               onClickUpdate={handleUpdate} onClickNext={onClickNext} onClickBack={onClickBack}
                               hasBack={hasBack} hasNext={hasNext}/></div>
    );
};

export {SpeedSettingsComponent};